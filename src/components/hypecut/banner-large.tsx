import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { PiVideoCameraFill } from 'react-icons/pi';

import { cn } from '@/lib/utils';

import hypecutLogo from '~/images/hypecut.png';

type Props = {
  className?: string;
};

export default function BannerLarge({ className }: Props) {
  return (
    <div className={cn('mt-3 flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-b from-[#F0C97E] to-[#F08B82] px-7 py-5 text-center text-black md:flex-row md:gap-6 md:text-left', className)}>
      <Image src={hypecutLogo} alt='Hypecut Logo' width={140} height={48} />
      <div className='grow'>
        <h3 className='text-2xl font-medium'>
          Enhance your reach with Videos.
        </h3>
        <p className='text-xs'>
          Our partner, Hypecut created 10 short videos in just 30 minutes of
          recording.
        </p>
      </div>
      <Link
        href='https://thehypecut.com/'
        target='_blank'
        className='flex h-9 items-center gap-1.5 rounded-lg bg-[#353535] px-2.5 text-sm'
      >
        <PiVideoCameraFill className='h-3.5 w-3.5 text-white/90' />
        <span className='text-white/90'>Create Video Now</span>
      </Link>
    </div>
  );
}
