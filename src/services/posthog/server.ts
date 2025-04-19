import { env } from '@/env';
import { PostHog } from 'posthog-node';

const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: 'https://eu.i.posthog.com',
  flushAt: 1,
  flushInterval: 0,
});

export default posthog;
