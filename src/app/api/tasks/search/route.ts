import { NextRequest, NextResponse } from 'next/server';
import { supabase } from 'src/lib/supabase';

// POST /api/tasks/search with body { q: string }
export async function POST(req: NextRequest) {
  try {
    if (!supabase || typeof supabase.from !== 'function') {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    const body = await req.json();
    const q = (body && body.q) || '';

    if (!q) {
      return NextResponse.json({ data: [] });
    }

    // Basic search on title and description using ilike
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[api/tasks/search] error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/tasks/search] unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
