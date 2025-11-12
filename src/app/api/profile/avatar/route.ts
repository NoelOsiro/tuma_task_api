import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/profile/avatar
 * Accepts multipart/form-data with a single file field `avatar`.
 * Uses SUPABASE_SERVICE_ROLE_KEY to upload to storage and returns the public URL.
 */

export async function POST(req: NextRequest) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[api/profile/avatar] missing supabase env');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const serverSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Validate Authorization header to determine user id
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    let id = 'public';
    if (token) {
      const { data: userData, error: userError } = await serverSupabase.auth.getUser(token);
      if (userError || !userData?.user) {
        console.error('[api/profile/avatar] invalid token', userError);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      id = userData.user.id;
    } else {
      // fallback to optional userId field, but require token in production
      const userId = (formData.get('userId') as string) || null;
      if (userId) id = userId;
    }

    // Build file path
    const filename = (file as any).name ?? `avatar_${Date.now()}`;
    const path = `${id}/${Date.now()}_${filename}`;

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = 'avatars';

    const { error: uploadError } = await serverSupabase.storage.from(bucket).upload(path, buffer, {
      contentType: (file as any).type || 'application/octet-stream',
      upsert: true,
    });

    if (uploadError) {
      console.error('[api/profile/avatar] upload error', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

  // For production we return a time-limited signed URL instead of a public URL
  // This keeps the bucket private and avoids exposing objects publicly.
  // TTL can be provided via query param `?ttl=` (seconds) or via env SIGNED_URL_TTL.
  const defaultTtl = process.env.SIGNED_URL_TTL ? Number(process.env.SIGNED_URL_TTL) : 60 * 60; // default 1 hour
  const requestedTtl = req.nextUrl?.searchParams?.get('ttl') ? Number(req.nextUrl.searchParams.get('ttl')) : undefined;
  // sanitize / clamp ttl to reasonable bounds (60s .. 24h)
  const expiresIn = Math.min(Math.max(requestedTtl ?? defaultTtl ?? 3600, 60), 24 * 60 * 60);
    const { data: signedData, error: signedError } = await serverSupabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (signedError) {
      console.error('[api/profile/avatar] signed url error', signedError);
      return NextResponse.json({ error: signedError.message }, { status: 500 });
    }

    const signedUrl = (signedData as any)?.signedUrl;

    return NextResponse.json({ signedUrl, path });
  } catch (err) {
    console.error('[api/profile/avatar] unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
