import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import React from 'react';
import {
  PiBookmarkSimple,
  PiBookmarkSimpleFill,
  PiMagicWand,
} from 'react-icons/pi';

import TInspiration from '@/lib/inspirations/type';
import useToogleInspirationSave from '@/lib/inspirations/use-toggle-save-inspiration';

import { Button } from '@/components/ui/button';

import { Trans } from '../ui/trans';

type Props = {
  inspiration: TInspiration;
  variant: 'generated' | 'saved';
};

export default function InspirationCard({ inspiration, variant }: Props) {
  const urlParams = new URLSearchParams({
    m: `Generate a post based on the inspiration: ${inspiration.text}`,
  }).toString();
  const url = `/dashboard/create?${urlParams}`;
  const toggleSaveInspiration = useToogleInspirationSave();
  const posthog = usePostHog();
  if (variant === 'saved')
    return (
      <div className='flex max-h-[12.5rem] flex-col gap-2 rounded-lg border border-[#1877F2] bg-white p-3 shadow-sm'>
        <div className='flex items-center justify-between'>
          {/* Category and sub category */}
          <div className='h-fit rounded-full bg-[#DEEDFF] px-2.5 py-1 text-[0.5rem]'>
            <Trans
              i18nKey={`app:${inspiration.category.toLocaleLowerCase()}`}
            />
          </div>
          {/* Bookmark icon */}
          <Button
            onClick={() => {
              if (inspiration.isSaved) {
                posthog.capture('inspiration_unsaved', {
                  inspiration_id: inspiration.id,
                });
              } else {
                posthog.capture('inspiration_saved', {
                  inspiration_id: inspiration.id,
                });
              }

              return toggleSaveInspiration.mutate({
                inspirationId: inspiration.id,
                isAlreadySaved: true,
              });
            }}
            style={{ boxShadow: '0px 2px 4px 0px rgba(42, 89, 255, 0.20)' }}
            className='h-6 w-6 rounded-full bg-white hover:bg-white/90'
            size='icon'
          >
            <PiBookmarkSimpleFill className='text-blue-4' />
          </Button>
        </div>

        <p className='grow overflow-hidden leading-[130%] text-black-1'>
          {inspiration.text}
        </p>
        <Link href={url}>
          <Button
            style={{ boxShadow: '0px 2px 4px 0px rgba(42, 89, 255, 0.20)' }}
            className='ml-auto h-6 w-6 rounded-full bg-blue-4 hover:bg-blue-4/90'
            size='icon'
          >
            <PiMagicWand className='shrink-0 text-white' />
          </Button>
        </Link>
      </div>
    );
  else
    return (
      <div
        style={{
          background: 'linear-gradient(154deg, #FFF -4.5%, #2AA6FF 154.55%)',
        }}
        className='flex max-h-[18.75rem] flex-col gap-2 rounded-lg p-3.5'
      >
        <div className='flex items-center justify-between'>
          {/* Category and sub category */}
          <div className='h-fit rounded-full bg-white px-2.5 py-1 text-[0.5rem]'>
            <Trans
              i18nKey={`app:${inspiration.category.toLocaleLowerCase()}`}
            />
          </div>
          {/* Bookmark icon */}
          <Button
            onClick={() => {
              if (inspiration.isSaved) {
                posthog.capture('inspiration_unsaved', {
                  inspiration_id: inspiration.id,
                });
              } else {
                posthog.capture('inspiration_saved', {
                  inspiration_id: inspiration.id,
                });
              }
              return toggleSaveInspiration.mutate({
                inspirationId: inspiration.id,
                isAlreadySaved: inspiration.isSaved,
              });
            }}
            style={{ boxShadow: '0px 2px 4px 0px rgba(42, 89, 255, 0.20)' }}
            className='h-6 w-6 rounded-full bg-white hover:bg-white/90'
            size='icon'
          >
            {inspiration.isSaved ? (
              <PiBookmarkSimpleFill className='text-blue-4' />
            ) : (
              <PiBookmarkSimple className='text-blue-4' />
            )}
          </Button>
        </div>

        <p
          style={{
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
          }}
          className='grow overflow-hidden leading-[130%] text-black-1'
        >
          {inspiration.text}
        </p>

        <Button
          style={{
            background:
              'linear-gradient(91deg, #001D4C 12.76%, #034888 92.11%)',
          }}
          className='mt-2 h-7 rounded-lg text-xs font-normal'
          asChild
        >
          <Link href={url}>
            <PiMagicWand className='mr-1 h-4 w-4' />
            <Trans i18nKey='app:createFromThis' />
          </Link>
        </Button>
      </div>
    );
}
