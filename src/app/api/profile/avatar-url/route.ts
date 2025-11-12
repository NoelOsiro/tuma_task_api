import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/profile/avatar-url?ttl=SECONDS
 * Auth: Bearer <access_token>
 *
 * Returns a fresh signed URL for the currently-authenticated user's avatar_path
 * (the storage object path saved in profiles.avatar_path). Uses the service role
 * key server-side to generate the signed url. TTL is clamped to [60, 86400].
 */

export async function GET(req: NextRequest) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[api/profile/avatar-url] missing supabase env');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const serverSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const { data: userData, error: userError } = await serverSupabase.auth.getUser(token);
    if (userError || !userData?.user) {
      console.error('[api/profile/avatar-url] invalid token', userError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = userData.user.id;

    // Fetch profile row
    const { data: profile, error: profileError } = await serverSupabase
      .from('profiles')
      .select('avatar_path')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('[api/profile/avatar-url] profile fetch error', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const avatarPath = profile?.avatar_path as string | undefined;
    if (!avatarPath) {
      return NextResponse.json({ data: null });
    }

    // TTL handling
    const url = new URL(req.url);
    const ttlParam = url.searchParams.get('ttl');
    const envTtl = process.env.SIGNED_URL_TTL ? Number(process.env.SIGNED_URL_TTL) : undefined;
    let ttl = ttlParam ? Number(ttlParam) : envTtl ?? 300; // default 5 minutes
    // clamp to sensible bounds
    if (Number.isNaN(ttl) || ttl <= 0) ttl = 300;
    ttl = Math.max(60, Math.min(86400, Math.floor(ttl)));

    // Create signed url for the object's path. Assumes bucket name 'avatars'.
    const bucket = process.env.AVATARS_BUCKET_NAME ?? 'avatars';
    const { data: signed, error: signedError } = await serverSupabase.storage
      .from(bucket)
      .createSignedUrl(avatarPath, ttl);

    if (signedError) {
      console.error('[api/profile/avatar-url] createSignedUrl error', signedError);
      return NextResponse.json({ error: signedError.message }, { status: 500 });
    }

    return NextResponse.json({ data: { signedUrl: signed?.signedUrl, path: avatarPath, expiresIn: ttl } });
  } catch (err) {
    console.error('[api/profile/avatar-url] unexpected error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
