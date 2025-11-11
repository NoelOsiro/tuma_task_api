import { NextRequest, NextResponse } from 'next/server';
import { supabase } from 'src/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    if (!supabase || typeof supabase.from !== 'function') {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Missing task data' }, { status: 400 });
    }

    const { data, error } = await supabase.from('tasks').insert([body]).select();

    if (error) {
      console.error('[api/tasks/create] insert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[api/tasks/create] unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
