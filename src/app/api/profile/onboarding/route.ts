import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * PATCH /api/profile/onboarding
 * Body: { onboarding?: boolean }   (defaults to true)
 * Auth: Bearer <access_token> (Supabase access token from client session)
 *
 * This route verifies the user's access token using the Supabase service role
 * client, then updates the `profiles.onboarding` boolean for that user.
 *
 * Important: set SUPABASE_SERVICE_ROLE_KEY in your environment (server-only).
 */

export async function PATCH(req: NextRequest) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[api/profile/onboarding] missing supabase env');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const serverSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Verify token and get user
    const { data: userData, error: userError } = await serverSupabase.auth.getUser(token);

    if (userError || !userData?.user) {
      console.error('[api/profile/onboarding] invalid token', userError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const onboarding = typeof body.onboarding === 'boolean' ? body.onboarding : true;

    // Allow optional profile fields to be updated during onboarding.
    // We store storage object path (avatar_path) instead of a long-lived signed URL.
    const updatePayload: any = { onboarding };
    if (typeof body.avatar_path === 'string' && body.avatar_path.length > 0) updatePayload.avatar_path = body.avatar_path;
    if (typeof body.full_name === 'string') updatePayload.full_name = body.full_name;
    if (typeof body.phone === 'string') updatePayload.phone = body.phone;

    const { data, error } = await serverSupabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[api/profile/onboarding] update error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/profile/onboarding] unexpected error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
