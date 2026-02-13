import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');
    
    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'covers';
    const projectSlug = formData.get('projectSlug') || 'temp';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${projectSlug}/${fileName}`;

    const { data, error } = await supabaseServer
      .storage
      .from('projects')
      .upload(filePath, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data: { publicUrl } } = supabaseServer
      .storage
      .from('projects')
      .getPublicUrl(filePath);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
