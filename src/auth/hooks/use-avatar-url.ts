"use client";

import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from './use-auth-context';

/**
 * Client hook that requests a fresh signed URL for the current user's avatar_path
 * by calling the server endpoint /api/profile/avatar-url. Respects the user's
 * access token supplied by the auth context.
 */
export function useAvatarUrl({ ttl }: { ttl?: number } = {}) {
  const { user } = useAuthContext();
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUrl = useCallback(async () => {
    if (!user?.accessToken && !user?.access_token) return null;
    setLoading(true);
    try {
      const token = user?.access_token || user?.accessToken;
      const q = ttl ? `?ttl=${encodeURIComponent(String(ttl))}` : '';
      const res = await fetch(`/api/profile/avatar-url${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      const signed = body?.data?.signedUrl || null;
      setUrl(signed);
      setLoading(false);
      return signed;
    } catch (err) {
      console.error('[useAvatarUrl] error', err);
      setUrl(null);
      setLoading(false);
      return null;
    }
  }, [user?.access_token, user?.accessToken, ttl]);

  useEffect(() => {
    fetchUrl();
  }, [fetchUrl]);

  return { url, loading, refresh: fetchUrl };
}
