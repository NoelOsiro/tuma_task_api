"use client";

import { useCallback, useEffect, useState } from 'react';

import axios from 'src/lib/axios';
import { useAuthContext } from './use-auth-context';

type UseOnboardingReturn = {
  onboarding: boolean | null;
  loading: boolean;
  setOnboarding: (value: boolean) => Promise<{ data?: any; error?: any } | null>;
};

export function useOnboarding(): UseOnboardingReturn {
  const { user, checkUserSession } = useAuthContext();

  const [onboarding, setOnboardingState] = useState<boolean | null>(
    user?.onboarding ?? null
  );
  const [loading, setLoading] = useState(false);

  // keep local onboarding in sync when user changes
  useEffect(() => {
    setOnboardingState(user?.onboarding ?? null);
  }, [user?.onboarding]);

  const setOnboarding = useCallback(
    async (value: boolean) => {
      if (!user?.id) {
        return { error: 'Not authenticated' };
      }

      setLoading(true);
      try {
        const res = await axios.patch('/profile/onboarding', { onboarding: value });

        const resp = res?.data;

        if (resp?.error) {
          console.error('[useOnboarding] server error', resp.error);
          setLoading(false);
          return { error: resp.error };
        }

        // Refresh session/profile in auth context so UI stays consistent
        if (typeof checkUserSession === 'function') {
          await checkUserSession();
        } else {
          // Fallback: update local state optimistically
          setOnboardingState(resp?.data?.onboarding ?? value);
        }

        setLoading(false);
        return { data: resp?.data };
      } catch (err) {
        console.error('[useOnboarding] unexpected error', err);
        setLoading(false);
        return { error: err };
      }
    },
    [user?.id, checkUserSession]
  );

  return { onboarding, loading, setOnboarding };
}
