import { NextRequest, NextResponse } from 'next/server';

/**
 * Lightweight Auth0 callback handler.
 *
 * Purpose:
 * - Prevent 404 when Auth0 redirects to /api/auth/callback
 * - Surface Auth0 errors back to the client sign-in page
 * - Redirect to the supplied returnTo (or `/`) on success
 *
 * Note: This handler is intentionally minimal. If you plan to perform a
 * server-side code exchange with Auth0 (Authorization Code flow), implement
 * the token exchange here and secure any client secrets via environment
 * variables. For SPA flows using `@auth0/auth0-react`, prefer a client-side
 * redirect URI (origin or a client callback route) and enable that URL in
 * your Auth0 Application settings.
 */

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    // Log for server-side debugging
    // (console output appears in your Next dev server terminal)
    console.log('[auth/callback] query:', Object.fromEntries(params.entries()));

    const error = params.get('error');
    const error_description = params.get('error_description');
    const returnTo = params.get('returnTo') || params.get('appState') || '/';

    // If Auth0 reported an error, redirect the user to the sign-in page
    // and include the error message so the UI can display it.
    if (error) {
      const dest = new URL('/auth/auth0/sign-in', req.nextUrl.origin);
      dest.searchParams.set('error', error);
      if (error_description) dest.searchParams.set('error_description', error_description);
      return NextResponse.redirect(dest);
    }

    // Otherwise redirect to the intended return path (safe relative redirect)
    // If returnTo is an absolute URL it will be respected; otherwise it's
    // resolved relative to the current origin.
    const dest = new URL(returnTo, req.nextUrl.origin);
    return NextResponse.redirect(dest);
  } catch (err) {
    console.error('[auth/callback] handler error:', err);
    // On unexpected errors, send user to sign-in with a generic message
    const dest = new URL('/auth/auth0/sign-in', req.nextUrl.origin);
    dest.searchParams.set('error', 'server_error');
    dest.searchParams.set('error_description', 'Unexpected server error handling Auth0 callback');
    return NextResponse.redirect(dest);
  }
}
