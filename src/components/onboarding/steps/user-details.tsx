import { TOnboardingForm } from '@/lib/onboarding/onboarding.form.schema';

import { FormInput } from '@/components/ui/form-input';
import { useTranslation } from 'react-i18next';
import { Trans } from '@/components/ui/trans';

const UserDetails = () => {
  const { t } = useTranslation('onboarding');
  return (
    <div className=''>
      <h1 className='text-center text-3xl font-semibold text-black sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]'>
        <Trans i18nKey='onboarding:tellUsWhoYouAre' />
      </h1>
      <div className='mx-auto mt-5 grid w-full max-w-2xl grid-cols-1 gap-3 px-4 sm:mt-8 sm:grid-cols-2 sm:gap-4 md:mt-11'>
        <FormInput<TOnboardingForm>
          name='firstName'
          label={t('onboarding:firstNameLabel')}
          placeholder={t('onboarding:firstNamePlaceholder')}
          onboardingStyles
        />
        <FormInput<TOnboardingForm>
          name='lastName'
          label={t('onboarding:lastNameLabel')}
          placeholder={t('onboarding:lastNamePlaceholder')}
          onboardingStyles
        />
        <FormInput<TOnboardingForm>
          name='companyName'
          label={t('onboarding:CompanyNameLabel')}
          placeholder={t('onboarding:CompanyNamePlaceholder')}
          onboardingStyles
          containerClassName='sm:col-span-2'
        />
      </div>
    </div>
  );
};

export default UserDetails;
