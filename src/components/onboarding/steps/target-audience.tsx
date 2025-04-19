import { useTranslation } from 'react-i18next';
import OnboardingItemCard from '../common/onboarding-item-card';

import CSuite from '/public/svg/c-suite.svg';
import EntryLevel from '/public/svg/entry-level.svg';
import HeadOfSales from '/public/svg/head-of-sales.svg';
import JobSeeker from '/public/svg/job-seeker.svg';
import Other from '/public/svg/other.svg';
import SmallBusinessOwner from '/public/svg/small-business-owner.svg';
import { Trans } from '@/components/ui/trans';

const TargetAudience = () => {
  const { t } = useTranslation('onboarding');
  const roleCardItems = [
    {
      title: t('EntryLevelProfessionals'),
      icon: EntryLevel,
    },
    {
      title: t('MidCareerManagers'),
      icon: HeadOfSales,
    },
    {
      title: t('CSuiteExecutives'),
      icon: CSuite,
    },
    {
      title: t('SmallBusinessOwners'),
      icon: SmallBusinessOwner,
    },
    {
      title: t('JobSeekers'),
      icon: JobSeeker,
    },
    {
      title: t('Other'),
      icon: Other,
    },
  ];
  return (
    <div className=''>
      <h1 className='text-center text-3xl font-semibold text-black sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]'>
        <Trans i18nKey='onboarding:yourTargetAudience' />
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
            formFields={['targetAudience']}
            otherField='otherTargetAudience'
          />
        ))}
      </div>
    </div>
  );
};

export default TargetAudience;
