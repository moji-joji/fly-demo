import React from 'react';

import PersonalInfo from './_components/personal-info';
import BillingInfo from './_components/billing-info';
import Preferences from './_components/preferences';

type Props = {};

export default function Settings({}: Props) {
  return (
    <div className='p-3 md:px-11 md:py-6'>
      <div className=''>
        <h1 className='mb-4 text-3xl font-semibold'>Settings</h1>
      </div>
      <div className='w-full space-y-4'>
        <div className='flex flex-col gap-4 xl:flex-row'>
          <PersonalInfo />
          <BillingInfo />
        </div>
        <Preferences />
      </div>
    </div>
  );
}
