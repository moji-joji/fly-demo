import { useFormContext } from 'react-hook-form';

import { TOnboardingForm } from './onboarding.form.schema';
import { useTranslation } from 'react-i18next';

export default function useIsContinueDisabled(currStep: number) {
  const values = useFormContext<TOnboardingForm>().watch();
  const { t } = useTranslation('onboarding');

  // for every step the logic to calculate if the continue button should be disabled
  // is different, so we need to check the step and return the correct logic

  switch (currStep) {
    case 1:
      return !values.firstName || !values.lastName || !values.companyName;
    case 2:
      return (
        !values.role ||
        (values.role === t('onboarding:Other') &&
          (!values.otherRole || !values.otherRole.trim()))
      );
    case 3:
      return values.linkedInGoals.length === 0;
    case 4:
      return values.linkedInTopics.length === 0;
    case 5:
      return !values.postTone;
    case 6:
      if (
        values.targetAudience.includes('Other') ||
        values.targetAudience.includes('Andere')
      ) {
        return (
          !values.otherTargetAudience || values.otherTargetAudience.length === 0
        );
      }
      return values.targetAudience.length === 0;
    case 7:
      return !values.companyUrl;
    default:
      return false;
  }
}
