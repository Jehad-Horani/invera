import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';
import { slugify } from '@/lib/slugify';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large: ${file.name}. Maximum size is 5MB.`;
  }
  return null;
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function extractStoragePath(publicUrl) {
  // Extract path after /object/public/projects/
  const match = publicUrl.match(/\/object\/public\/projects\/(.+)$/);
  return match ? match[1] : null;
}

async function uploadFile(file, folder, slug) {
  const timestamp = Date.now();
  const safeName = sanitizeFileName(file.name);
  const filePath = `${folder}/${slug}/${timestamp}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseServer.storage
    .from('projects')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Upload failed for ${file.name}: ${error.message}`);

  const { data: { publicUrl } } = supabaseServer.storage
    .from('projects')
    .getPublicUrl(filePath);

  return publicUrl;
}

async function deleteStorageFile(publicUrl) {
  const path = extractStoragePath(publicUrl);
  if (path) {
    await supabaseServer.storage.from('projects').remove([path]);
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');

    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Fetch existing project
    const { data: existingProject, error: fetchError } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const name = formData.get('name') || existingProject.name;
    let slug = existingProject.slug;

    // Regenerate slug if name changed
    if (name !== existingProject.name) {
      slug = slugify(name);
      const { data: slugExists } = await supabaseServer
        .from('projects')
        .select('slug')
        .eq('slug', slug)
        .neq('id', id)
        .maybeSingle();

      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Handle cover image replacement
    let coverUrl = existingProject.cover_image_url;
    const newCoverFile = formData.get('cover_image');

    if (newCoverFile && newCoverFile instanceof File && newCoverFile.size > 0) {
      const coverError = validateFile(newCoverFile);
      if (coverError) {
        return NextResponse.json({ error: coverError }, { status: 400 });
      }
      // Delete old cover from storage
      if (existingProject.cover_image_url) {
        await deleteStorageFile(existingProject.cover_image_url);
      }
      coverUrl = await uploadFile(newCoverFile, 'covers', slug);
    }

    // Handle gallery images
    // existing_gallery_urls: URLs from the current gallery to keep
    const existingGalleryJson = formData.get('existing_gallery_urls');
    let keptGalleryUrls = [];
    if (existingGalleryJson) {
      try {
        keptGalleryUrls = JSON.parse(existingGalleryJson);
      } catch {
        keptGalleryUrls = [];
      }
    }

    // Determine which old gallery images were removed
    const oldGallery = Array.isArray(existingProject.gallery) ? existingProject.gallery : [];
    const removedUrls = oldGallery.filter((url) => !keptGalleryUrls.includes(url));

    // Delete removed gallery images from storage
    for (const url of removedUrls) {
      await deleteStorageFile(url);
    }

    // Upload new gallery files
    const newGalleryFiles = formData.getAll('gallery_images').filter(
      (f) => f instanceof File && f.size > 0
    );

    for (const gf of newGalleryFiles) {
      const gError = validateFile(gf);
      if (gError) {
        return NextResponse.json({ error: gError }, { status: 400 });
      }
    }

    const newGalleryUrls = [];
    for (const gf of newGalleryFiles) {
      const url = await uploadFile(gf, 'gallery', slug);
      newGalleryUrls.push(url);
    }

    const finalGallery = [...keptGalleryUrls, ...newGalleryUrls];

    // Update project in DB
    const { data: project, error } = await supabaseServer
      .from('projects')
      .update({
        name,
        slug,
        category: formData.get('category') || existingProject.category,
        location: formData.get('location') || null,
        year: formData.get('year') ? parseInt(formData.get('year')) : null,
        cover_image_url: coverUrl,
        gallery: finalGallery,
        summary: formData.get('summary') || null,
        story: formData.get('story') || null,
        scope: formData.get('scope') || null,
        materials: formData.get('materials') || null,
        area_sqm: formData.get('area_sqm') ? parseInt(formData.get('area_sqm')) : null,
        client_name: formData.get('client_name') || null,
        is_featured: formData.get('is_featured') === 'true',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
