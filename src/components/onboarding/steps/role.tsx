import { useTranslation } from 'react-i18next';
import OnboardingItemCard from '../common/onboarding-item-card';

import AccountExecutive from '/public/svg/account-executive.svg';
import HeadOfSales from '/public/svg/head-of-sales.svg';
import Other from '/public/svg/other.svg';
import Sales from '/public/svg/sales.svg';
import { Trans } from '@/components/ui/trans';

const Role = () => {
  const { t } = useTranslation('onboarding');

  const roleCardItems = [
    {
      title: t('AccountsExecutive'),
      icon: AccountExecutive,
    },
    {
      title: t('SalesDevelopmentRep'),
      icon: Sales,
    },
    {
      title: t('HeadOfSales'),
      icon: HeadOfSales,
    },
    {
      title: t('Other'),
      icon: Other,
    },
  ];

  return (
    <div>
      <h1 className='text-center text-3xl font-semibold text-black sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]'>
        <Trans i18nKey='onboarding:yourRole' />
      </h1>
      <div className='mx-auto mt-7 grid max-w-lg grid-cols-2 gap-3 px-4 sm:mt-8 md:max-w-2xl md:grid-cols-3 md:gap-6 lg:mt-14 lg:max-w-[52rem] lg:grid-cols-4'>
        {roleCardItems.map(({ title, icon }) => (
          <OnboardingItemCard
            key={title}
            text={title}
            icon={icon}
            formFields={['role']}
            otherField='otherRole'
          />
        ))}
      </div>
    </div>
  );
};

export default Role;
