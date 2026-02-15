import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';
import { slugify } from '@/lib/slugify';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');

    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get('name');
    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const coverFile = formData.get('cover_image');
    if (!coverFile || !(coverFile instanceof File) || coverFile.size === 0) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 });
    }

    // Validate cover file
    const coverError = validateFile(coverFile);
    if (coverError) {
      return NextResponse.json({ error: coverError }, { status: 400 });
    }

    // Collect gallery files
    const galleryFiles = formData.getAll('gallery_images').filter(
      (f) => f instanceof File && f.size > 0
    );

    // Validate gallery files
    for (const gf of galleryFiles) {
      const gError = validateFile(gf);
      if (gError) {
        return NextResponse.json({ error: gError }, { status: 400 });
      }
    }

    // Generate unique slug
    let slug = slugify(name);
    const { data: existing } = await supabaseServer
      .from('projects')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Upload cover image
    const coverUrl = await uploadFile(coverFile, 'covers', slug);

    // Upload gallery images
    const galleryUrls = [];
    for (const gf of galleryFiles) {
      const url = await uploadFile(gf, 'gallery', slug);
      galleryUrls.push(url);
    }

    // Insert project into DB
    const { data: project, error } = await supabaseServer
      .from('projects')
      .insert({
        name,
        slug,
        category: formData.get('category') || 'real_estate',
        location: formData.get('location') || null,
        year: formData.get('year') ? parseInt(formData.get('year')) : null,
        cover_image_url: coverUrl,
        gallery: galleryUrls,
        summary: formData.get('summary') || null,
        story: formData.get('story') || null,
        scope: formData.get('scope') || null,
        materials: formData.get('materials') || null,
        area_sqm: formData.get('area_sqm') ? parseInt(formData.get('area_sqm')) : null,
        client_name: formData.get('client_name') || null,
        is_featured: formData.get('is_featured') === 'true',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
