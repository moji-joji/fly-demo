import { Trans } from '@/components/ui/trans';
import OnboardingItemCard from '../common/onboarding-item-card';

import Announcement from '/public/svg/announcements.svg';
import CaseStudies from '/public/svg/case-studies.svg';
import Education from '/public/svg/education.svg';
import News from '/public/svg/news.svg';
import Rocket from '/public/svg/rocket.svg';
import Tips from '/public/svg/strategy.svg';
import Trophy from '/public/svg/trophy.svg';
import Updates from '/public/svg/updates.svg';
import { useTranslation } from 'react-i18next';

const Topics = () => {
  const { t } = useTranslation('onboarding');
  const roleCardItems = [
    {
      title: t('ProductLaunches'),
      icon: Rocket,
    },
    {
      title: t('CompanyUpdates'),
      icon: Updates,
    },
    {
      title: t('IndustryNews'),
      icon: News,
    },
    {
      title: t('PersonalAchievements'),
      icon: Trophy,
    },
    {
      title: t('CaseStudies'),
      icon: CaseStudies,
    },
    {
      title: t('EventAnnouncements'),
      icon: Announcement,
    },
    {
      title: t('TipsAndStrategies'),
      icon: Tips,
    },
    {
      title: t('EducationalContent'),
      icon: Education,
    },
  ];
  return (
    <div className=''>
      <h1 className='text-center text-3xl font-semibold text-black sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]'>
        <Trans i18nKey='onboarding:topicsYouWantToShare' />
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
            formFields={['linkedInTopics']}
          />
        ))}
      </div>
    </div>
  );
};

export default Topics;
