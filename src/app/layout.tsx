import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import './globals.css';

import { createI18nServerInstance } from '@/lib/i18n/i18n.server';
import getMetadata from '@/lib/seo';
import { cn } from '@/lib/utils';

import { I18nProviderWrapper } from '@/services/i18n/wrapper';
import Identify from '@/services/posthog/identify';
import PHPageView from '@/services/posthog/page-view';
import PostHogProvider from '@/services/posthog/provider';
import RQProvider from '@/services/react-query/provider';

const jakartaSnas = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--jakarta-sans',
});

export const metadata = getMetadata({});

export default async function RootLayout({
  children,
}: Readonly<{
  lang: string;
  children: React.ReactNode;
}>) {
  const { language } = await createI18nServerInstance();

  return (
    <html lang={language} className={cn('light', jakartaSnas.variable)}>
      <RQProvider>
        <PostHogProvider>
          <I18nProviderWrapper lang={language}>
            <body className='bg-[#EDF4F7]}'>
              {children}
              <Toaster />
              <Analytics />
              <Identify />
              <Suspense fallback={null}>
                <PHPageView />
              </Suspense>
              <ReactQueryDevtools initialIsOpen={false} />
              <Script src='/brevo.js' strategy='lazyOnload' />
            </body>
          </I18nProviderWrapper>
        </PostHogProvider>
      </RQProvider>
    </html>
  );
}
