'use client';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

import { env } from '@/env';

if (typeof window !== 'undefined') {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: '/ingest',
    // person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    capture_pageleave: true, // Enable pageleave capture
    debug: process.env.NODE_ENV === 'development',
  });
}
export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
