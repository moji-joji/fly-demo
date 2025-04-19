'use client';

import ErrorScreen from '@/components/error-screen';
import LoadingAnimation from '@/components/loading-animation';
import useAccount from '@/lib/account/use-account';
import React from 'react';
import SectionCard from '../section-card';
import ProfilePhoto from './profile-picture';
import ProfileForm from './profile-form';
import { useTranslation } from 'react-i18next';

export default function PersonalInfo() {
  const userProfile = useAccount();
  const { t } = useTranslation('app');

  if (userProfile.isPending) return null;

  if (userProfile.error) return <ErrorScreen />;

  return (
    <SectionCard className='w-full xl:w-1/2' title={t('profileInformation')}>
      <ProfilePhoto
        avatar={userProfile.data.avatar ?? undefined}
        userId={userProfile.data.id}
      />
      <ProfileForm
        defaultValues={{
          name: userProfile.data.name ?? undefined,
          email: userProfile.data.email,
        }}
      />
    </SectionCard>
  );
}
