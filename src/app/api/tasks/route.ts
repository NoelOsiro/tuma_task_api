import { NextRequest, NextResponse } from 'next/server';
import { supabase } from 'src/lib/supabase';

// GET /api/tasks -> list
// DELETE /api/tasks?id=... -> delete

export async function GET(req: NextRequest) {
  try {
    if (!supabase || typeof supabase.from !== 'function') {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 100;
    const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : 0;

    const { data, error } = await supabase.from('tasks').select('*').range(offset, offset + limit - 1).order('created_at', { ascending: false });

    if (error) {
      console.error('[api/tasks] list error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/tasks] GET unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!supabase || typeof supabase.from !== 'function') {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });

    const { data, error } = await supabase.from('tasks').delete().eq('id', id).select();

    if (error) {
      console.error('[api/tasks] delete error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/tasks] DELETE unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
