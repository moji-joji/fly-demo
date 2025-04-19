import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    ANTHROPIC_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    BREVO_API_KEY: z.string(),
    LOOPS_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default('https://example.com'),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_CRISP_WEBSITE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_CRISP_WEBSITE_ID: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
    NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    LOOPS_API_KEY: process.env.LOOPS_API_KEY,
  },
});
