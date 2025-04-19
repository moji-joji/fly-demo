import React from 'react';

import OnboardingItemCard from '../common/onboarding-item-card';

import Funnel from '/public/svg/funnel.svg';
import Globe from '/public/svg/globe.svg';
import HandShake from '/public/svg/handshake.svg';
import Magnify from '/public/svg/magnify.svg';
import { useTranslation } from 'react-i18next';
import { Trans } from '@/components/ui/trans';

const Goals = () => {
  const { t } = useTranslation('onboarding');
  const roleCardItems = [
    {
      title: t('GrowNetwork'),
      icon: Globe,
    },
    {
      title: t('BoostVisibility'),
      icon: Magnify,
    },
    {
      title: t('GenerateLeadsForMyPipeline'),
      icon: Funnel,
    },
    {
      title: t('EngageWithMyBuyerPersona'),
      icon: HandShake,
    },
  ];
  return (
    <div className=''>
      <h1 className='text-center text-3xl font-semibold text-black sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]'>
        <Trans i18nKey='onboarding:yourLinkedInGoals' />
      </h1>
      <p className='mt-3 text-center text-sm text-gray-500'>
        (<Trans i18nKey='onboarding:selectOneOrMore' />)
      </p>
      <div className='mx-auto mt-7 grid max-w-lg grid-cols-2 gap-3 px-4 sm:mt-8 md:max-w-2xl md:grid-cols-3 md:gap-6 lg:mt-14 lg:max-w-[52rem] lg:grid-cols-4'>
        {roleCardItems.map(({ title, icon }) => (
          <OnboardingItemCard
            key={title}
            text={title}
            icon={icon}
            formFields={['linkedInGoals']}
          />
        ))}
      </div>
    </div>
  );
};

export default Goals;
