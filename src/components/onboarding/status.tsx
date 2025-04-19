import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

import bgGradient from '~/images/gradient.png';
import flyLogo from '~/images/logo.png';

type Props = {
  status: 'submitting' | 'error';
};

export default function Submitting({ status }: Props) {
  const { t } = useTranslation('onboarding');

  return (
    <main>
      <Image
        src={bgGradient}
        alt='Gradient'
        fill
        className='object-cover object-center'
        placeholder='blur'
        quality={50}
      />

      <div className='relative z-10 grid h-screen w-screen place-content-center'>
        <div
          style={{
            boxShadow: '-2px 0px 30px 0px rgba(67, 67, 67, 0.20)',
          }}
          className='max-w-md rounded-3xl border-[#DEEDFF] border-[3] bg-white px-16 py-6 text-center'
        >
          <Image
            src={flyLogo}
            alt='@'
            width={148}
            height={150}
            className='mx-auto'
          />
          <h2 className='mt-3 text-2xl font-bold text-black-1'>
            {t('settingUpYourDashboard')}
          </h2>

          {status === 'submitting' ? (
            <Loader2 className='mx-auto mt-4 h-14 w-14 animate-spin text-blue-4' />
          ) : (
            <p className='mt-4 text-sm text-red-500'>{t('issue')}</p>
          )}
        </div>
      </div>
    </main>
  );
}
