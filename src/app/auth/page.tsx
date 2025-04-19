import Image from 'next/image';
import React from 'react';

import { withI18n } from '@/lib/i18n/with-i18n';

import { Trans } from '@/components/ui/trans';

import AuthForm from './_components/auth-form';

import sidePanelImg from '~/images/auth-side-panel.png';

type Props = {};

function Auth({}: Props) {
  return (
    <main className='flex h-screen'>
      <div className='relative hidden h-full lg:block lg:w-1/2'>
        <Image
          src={sidePanelImg}
          className='object-cover object-center'
          fill
          alt='Side Panel'
          quality={50}
        />
      </div>
      <div className='flex h-full w-full items-center justify-center bg-[#EDF4F7] lg:w-1/2'>
        <div className='max-w-lg text-center'>
          <h1 className='mb-1 text-6xl font-bold'>
            <Trans i18nKey='app:welcomeToFly' />
          </h1>
          <span className='text-xl'>
            <Trans i18nKey='app:ultimateLinkedInAssistant' />
          </span>

          <p className='py-6 text-xs'>
            <Trans i18nKey='app:empowerLinkedInPresence' />
          </p>

          <AuthForm />
        </div>
      </div>
    </main>
  );
}

export default withI18n(Auth);
