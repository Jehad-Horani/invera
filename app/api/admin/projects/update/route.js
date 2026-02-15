import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';
import { slugify } from '@/lib/slugify';

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get('admin_auth');
    
    if (!auth || auth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updates } = data;

    // Regenerate slug when name changes
    if (updates.name) {
      updates.slug = slugify(updates.name);
    }

    const { data: project, error } = await supabaseServer
      .from('projects')
      .update(updates)
      .eq('id', id)
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
