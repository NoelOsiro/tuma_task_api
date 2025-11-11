import { NextRequest, NextResponse } from 'next/server';
import { supabase } from 'src/lib/supabase';

export async function PUT(req: NextRequest) {
  try {
    if (!supabase || typeof supabase.from !== 'function') {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { id, ...updates } = body ?? {};

    if (!id) return NextResponse.json({ error: 'Missing id in request body' }, { status: 400 });

    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select();

    if (error) {
      console.error('[api/tasks/update] update error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/tasks/update] unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
