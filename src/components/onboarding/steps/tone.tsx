import { useTranslation } from 'react-i18next';
import OnboardingItemCard from '../common/onboarding-item-card';

import Book from '/public/svg/book.svg';
import Chat from '/public/svg/chat.svg';
import Bulb from '/public/svg/lightbulb.svg';
import Tie from '/public/svg/tie.svg';
import { Trans } from '@/components/ui/trans';

const Tone = () => {
  const { t } = useTranslation('onboarding');
  const roleCardItems = [
    {
      title: t('ProfessionalAndFormal'),
      icon: Tie,
    },
    {
      title: t('CasualAndConversational'),
      icon: Chat,
    },
    {
      title: t('InspirationalAndMotivational'),
      icon: Bulb,
    },
    {
      title: t('EducationalAndInformative'),
      icon: Book,
    },
  ];
  return (
    <div>
      <h1 className='text-center text-3xl font-semibold text-black sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]'>
        <Trans i18nKey='onboarding:selectToneForYourPosts' />
      </h1>
      <div className='mx-auto mt-7 grid max-w-lg grid-cols-2 gap-3 px-4 sm:mt-8 md:max-w-2xl md:grid-cols-3 md:gap-6 lg:mt-14 lg:max-w-[52rem] lg:grid-cols-4'>
        {roleCardItems.map(({ title, icon }) => (
          <OnboardingItemCard
            key={title}
            text={title}
            icon={icon}
            formFields={['postTone']}
          />
        ))}
      </div>
    </div>
  );
};

export default Tone;
