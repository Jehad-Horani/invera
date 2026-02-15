import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';

function extractStoragePath(publicUrl) {
  const match = publicUrl.match(/\/object\/public\/projects\/(.+)$/);
  return match ? match[1] : null;
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');

    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Fetch project to get image paths before deletion
    const { data: project, error: fetchError } = await supabaseServer
      .from('projects')
      .select('cover_image_url, gallery, slug')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    // Collect all storage paths to delete
    const pathsToDelete = [];

    if (project.cover_image_url) {
      const coverPath = extractStoragePath(project.cover_image_url);
      if (coverPath) pathsToDelete.push(coverPath);
    }

    const gallery = Array.isArray(project.gallery) ? project.gallery : [];
    for (const url of gallery) {
      const galleryPath = extractStoragePath(url);
      if (galleryPath) pathsToDelete.push(galleryPath);
    }

    // Delete files from storage
    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabaseServer.storage
        .from('projects')
        .remove(pathsToDelete);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with DB deletion even if storage cleanup fails
      }
    }

    // Delete the project row from DB
    const { error } = await supabaseServer
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
