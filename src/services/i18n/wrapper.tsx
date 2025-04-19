'use client';
import React from 'react';

import { i18nResolver } from '@/lib/i18n/i18n.resolver';
import { getI18nSettings } from '@/lib/i18n/i18n.settings';

import { I18nProvider } from './provider';

interface I18nProviderWrapperProps {
  lang: string;
  children: React.ReactNode;
}

export function I18nProviderWrapper({
  lang,
  children,
}: I18nProviderWrapperProps) {
  const i18nSettings = getI18nSettings(lang);

  return (
    <I18nProvider settings={i18nSettings} resolver={i18nResolver}>
      {children}
    </I18nProvider>
  );
}
