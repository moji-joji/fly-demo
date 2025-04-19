import { Metadata } from 'next';

import { env } from '@/env';

const siteConfig = {
  defaultTitle: 'Fly',
  defaultDescription: 'Generate content for your linkedin following',
  baseUrl: env.NEXT_PUBLIC_SITE_URL,
};

/**
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */

export default function getMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: siteConfig.defaultTitle,
      template: '%s | Fly',
    },
    description: siteConfig.defaultDescription,
    icons: {
      icon: '/favicon/favicon.ico',
      shortcut: '/favicon/favicon-16x16.png',
      apple: '/favicon/apple-touch-icon.png',
    },
    manifest: `/favicon/site.webmanifest`,
    openGraph: {
      url: siteConfig.baseUrl,
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      siteName: siteConfig.defaultTitle,
      images: '/images/preview-img.png',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      images: '/images/preview-img.png',
    },
    ...overrides,
  };
}
