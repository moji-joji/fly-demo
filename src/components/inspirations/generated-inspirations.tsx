'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiSparkleDuotone } from 'react-icons/pi';
import { toast } from 'sonner';

import useAccount from '@/lib/account/use-account';
import useGenerateMoreInspirations from '@/lib/inspirations/use-generate-more-inspirations';
import useGeneratedInspirations from '@/lib/inspirations/use-generated-inspirations';

import { Button } from '@/components/ui/button';

import InspirationCard from './inspiration-card';
import InpirationLoaderCard from './inspiration-loader-card';
import { Trans } from '../ui/trans';

type Props = {};

export default function GeneratedInspirations({}: Props) {
  const account = useAccount();
  const inspirations = useGeneratedInspirations();
  const generateMore = useGenerateMoreInspirations();
  const { t } = useTranslation();
  return (
    <div
      style={{
        background:
          'linear-gradient(127deg, #2AA6FF -9.18%, #000741 42.6%, #000741 94.39%)',
      }}
      className='rounded-2xl px-4 py-4 pb-5'
    >
      <h3 className='text-center text-xl font-semibold text-white md:text-2xl'>
        <Trans i18nKey='app:personalizedContent' />
      </h3>
      <p className='text-center text-xs text-white/70'>
        <Trans i18nKey='app:personalizedContentDescription' />
      </p>

      <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-3'>
        {inspirations.isPending || generateMore.isPending ? (
          Array.from({ length: 3 }).map((_, i) => (
            <InpirationLoaderCard idx={i} key={i} />
          ))
        ) : inspirations.isError ? (
          <div>Error</div>
        ) : (
          inspirations.data.map((inspiration) => (
            <InspirationCard
              key={inspiration.id}
              inspiration={inspiration}
              variant='generated'
            />
          ))
        )}
      </div>

      <div className='mx-auto mt-5 w-fit'>
        <Button
          disabled={generateMore.isPending}
          onClick={() => {
            if (account.data?.credits === 0) {
              toast.error(t('app:noCreditsForInspo'));

              return;
            }
            generateMore.mutate();
          }}
          className='h-10 rounded-lg bg-white text-blue-4 hover:bg-white/90'
        >
          <PiSparkleDuotone className='mr-1 h-5 w-5' />
          <Trans i18nKey='app:generateMore' />
        </Button>
      </div>
    </div>
  );
}
