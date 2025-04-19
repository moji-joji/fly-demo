'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { PiVideoCameraFill } from 'react-icons/pi';

import hypecutLogo from '~/images/hypecut.png';

type Props = {};

export default function BannerSmall({}: Props) {
  const pathname = usePathname();

  if (pathname === '/dashboard') return null;

  return (
    <Link className='mb-2' href='https://thehypecut.com/'>
      <div className='flex items-center rounded-md bg-gradient-to-b from-[#F0C97E] to-[#F08B82] px-2.5 py-2'>
        <div className='flex grow flex-col gap-1'>
          <Image src={hypecutLogo} alt='Hypecut Logo' width={51} height={16} />
          <span className='text-xs text-[#393939]'>
            Create Videos with hypecut.
          </span>
        </div>
        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#353535]'>
          <PiVideoCameraFill className='h-4 w-4 text-white/90' />
        </div>
      </div>
    </Link>
  );
}
