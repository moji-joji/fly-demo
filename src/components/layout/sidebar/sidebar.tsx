import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

import BannerSmall from '@/components/hypecut/banner-small';

import PlanDetails from './plan-details';
import Profile from './profile';
import SidebarNavList from './sidebar-nav-list';

import flylogo from '~/images/logo.png';

type Props = {
  className?: string;
};

export default function Sidebar({ className }: Props) {
  return (
    <div className={cn('flex flex-col bg-white shadow-lg', className)}>
      {/* The logo */}
      <Link href='/dashboard'>
        <Image
          src={flylogo}
          alt='Fly Logo'
          width={100}
          height={50}
          className='mb-8'
        />
      </Link>
      <div className='grow'>
        <SidebarNavList />
      </div>

      <BannerSmall />
      <PlanDetails />

      <Profile />
    </div>
  );
}
