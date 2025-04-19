'use client';

import React from 'react';
import SectionCard from './section-card';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {};

export default function Preferences({}: Props) {
  const { t } = useTranslation('app');

  return (
    <SectionCard title={t('preferences')}>
      <div className='flex flex-col'>
        <p className='text-sm'>{t('preferencesDescription')}</p>
        <Link
          className={cn(buttonVariants(), 'mt-4 w-fit self-end')}
          href='/onboarding'
        >
          {t('preferencesButton')}
        </Link>
      </div>
    </SectionCard>
  );
}
