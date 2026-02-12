import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';
import { slugify } from '@/lib/slugify';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');
    
    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Create slug
    const slug = slugify(data.name);
    
    // Insert project
    const { data: project, error } = await supabaseServer
      .from('projects')
      .insert({
        name: data.name,
        slug,
        category: data.category,
        location: data.location || null,
        year: data.year ? parseInt(data.year) : null,
        cover_image_url: data.cover_image_url,
        gallery: data.gallery || [],
        summary: data.summary || null,
        story: data.story || null,
        scope: data.scope || null,
        materials: data.materials || null,
        area_sqm: data.area_sqm ? parseInt(data.area_sqm) : null,
        client_name: data.client_name || null,
        is_featured: data.is_featured || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
