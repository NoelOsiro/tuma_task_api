'use client';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { CONFIG } from 'src/global-config';

import axios from 'src/lib/axios';
import { supabase } from 'src/lib/supabase';

import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });
  const router = useRouter();
  const pathname = usePathname();

  const checkUserSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setState({ user: null, loading: false });
        console.error(error);
        throw error;
      }

      if (session) {
        const accessToken = session?.access_token;

        const userFromSession = { ...session, ...session?.user } as any;

        // Try to fetch the profile row to surface onboarding and profile fields
        let profile: any = null;
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding, full_name, avatar_path, avatar_path, role, phone')
            .eq('id', userFromSession.id)
            .single();

          if (profileError) {
            // Log but don't block session establishment
            console.warn('[auth] failed to load profile', profileError.message || profileError);
          } else {
            profile = profileData;
          }
        } catch (err) {
          console.error('[auth] unexpected error loading profile', err);
        }

        setState({
          user: { ...userFromSession, profile, onboarding: profile?.onboarding ?? false },
          loading: false,
        });
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        setState({ user: null, loading: false });
        delete axios.defaults.headers.common.Authorization;
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to onboarding flow when the user's profile indicates onboarding is required
  useEffect(() => {
    try {
      const user = state.user as any;

      if (!user) return; // nothing to do

      const isOnboarding = typeof user.onboarding === 'boolean' ? user.onboarding === false : false;

      const onboardingRoute = '/onboarding';

      // If user needs onboarding and is not already on the onboarding route, redirect there
      if (isOnboarding && pathname !== onboardingRoute) {
        router.replace(onboardingRoute);
        return;
      }

      // If user completed onboarding and is currently on the onboarding route, send to configured redirect
      if (!isOnboarding && pathname === onboardingRoute) {
        const target = CONFIG.auth.redirectPath || '/dashboard';
        router.replace(target);
      }
    } catch (err) {
      // swallow navigation errors
      console.error('[auth] onboarding redirect error', err);
    }
    // only watch state.user and pathname
  }, [state.user, pathname, router]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            id: state.user?.id,
            accessToken: state.user?.access_token,
            displayName: `${state.user?.user_metadata.display_name}`,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
