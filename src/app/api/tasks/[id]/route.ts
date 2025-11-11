import { NextRequest, NextResponse } from 'next/server';
import { supabase } from 'src/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!supabase || typeof supabase.from !== 'function') {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    const id = params.id;

    if (!id) return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });

    const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();

    if (error) {
      console.error('[api/tasks/[id]] get error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/tasks/[id]] unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
