import Image from 'next/image';
import React from 'react';
import { PiList } from 'react-icons/pi';

import { withI18n } from '@/lib/i18n/with-i18n';

import CreditsBanner from '@/components/layout/credits-banner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import Sidebar from '../../components/layout/sidebar/sidebar';

type Props = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: Props) {
  return (
    <main className='flex h-screen flex-col'>
      <CreditsBanner />
      {/* Mobile header */}
      <div className='flex items-center justify-between p-2 pt-8 lg:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button size='icon' variant='ghost'>
              <PiList className='h-6 w-6' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-[18.5rem] p-4'>
            <Sidebar className='h-full bg-transparent shadow-none' />
          </SheetContent>
        </Sheet>
        <div className='grow'>
          <Image
            src='/images/logo.png'
            className='mx-auto'
            alt='Logo'
            width={80}
            height={30}
          />
        </div>
        <div className='invisible h-9 w-9' />
      </div>
      <div className='flex grow'>
        <Sidebar className='hidden h-screen w-[16rem] p-3 lg:flex lg:pt-5 xl:w-[18.5rem] xl:p-6 xl:pt-9' />
        <div className='hide-scrollbars h-screen grow overflow-auto lg:pt-5'>
          {children}
        </div>
      </div>
    </main>
  );
}

export default withI18n(DashboardLayout);
