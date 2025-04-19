'use client';

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import { createClient } from '../supabase/client';

export default function Identify() {
  const posthog = usePostHog();
  const supabase = createClient();

  // subscribe to supabase auth changes
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email,
        });
        Sentry.setUser({
          email: session.user.email,
          id: session.user.id,
        });
      } else if (event === 'SIGNED_OUT') {
        posthog.reset();
        Sentry.setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [posthog, supabase]);

  return null;
}
