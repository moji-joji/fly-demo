'use client';

import React from 'react';

import useSavedInspirations from '@/lib/inspirations/use-saved-inspirations';

import InspirationCard from './inspiration-card';
import { Trans } from '../ui/trans';

type Props = {};

export default function SavedInspirations({}: Props) {
  const savedInspirations = useSavedInspirations();

  if (!savedInspirations.data) return null;

  return (
    <div className='rounded-2xl bg-white px-4 py-4 pb-5 border'>
      <h3 className='text-center text-2xl font-medium text-primary'>
        <Trans i18nKey='app:yourSavedIdeas' />
      </h3>

      {savedInspirations.data.length === 0 ? (
        <div className='py-10 text-center text-black/60'>
          <Trans i18nKey='app:ideasYouSaved' />
        </div>
      ) : (
        <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
          {savedInspirations.data?.map((savedItem) => (
            <InspirationCard
              key={savedItem.id}
              inspiration={savedItem}
              variant='saved'
            />
          ))}
        </div>
      )}
    </div>
  );
}
