import { TOnboardingForm } from '@/lib/onboarding/onboarding.form.schema';

import { FormInput } from '@/components/ui/form-input';
import { Trans } from '@/components/ui/trans';
import { useTranslation } from 'react-i18next';

const CompanyUrl = () => {
  const { t } = useTranslation('onboarding');
  return (
    <div>
      <h1 className='text-center text-3xl font-semibold text-black sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]'>
        <Trans i18nKey='onboarding:companyInfo' />
      </h1>
      <div className='mx-auto mt-7 w-fit sm:mt-8 lg:mt-14 '>
        <FormInput<TOnboardingForm>
          name='companyUrl'
          label={t('onboarding:companyUrlLabel')}
          placeholder={t('onboarding:companyUrlPlaceholder')}
          className='h-12 w-[21.875rem] rounded-lg px-[0.875rem] py-[0.625rem] placeholder:text-[#C0C0C0] md:w-[31.25rem] xl:w-[38.75rem]'
        />
        <p className='mt-1 w-[18.75rem] text-xs font-light text-[#9FA6AF] md:w-[37.5rem] text-center'>
          <Trans i18nKey='onboarding:comapnyInfoUsage' />
        </p>
      </div>
    </div>
  );
};

export default CompanyUrl;
