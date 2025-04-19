'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { FieldPath, useFormContext } from 'react-hook-form';
import { PiCaretLeft } from 'react-icons/pi';

import { TOnboardingForm } from '@/lib/onboarding/onboarding.form.schema';
import useIsContinueDisabled from '@/lib/onboarding/useIsContinueDisabled';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Trans } from '@/components/ui/trans';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';

type Props = {
  currStep: number;
  onSubmit: (data: TOnboardingForm) => void;
};

type FormField = FieldPath<TOnboardingForm>;

const steps = [
  {
    id: 'Step 1',
    name: 'User Details',
    fields: ['firstName', 'lastName', 'companyName'],
    // fields: [],
  },
  {
    id: 'Step 2',
    name: 'Role',
    fields: ['role', 'otherRole'],
    // fields: [],
  },
  {
    id: 'Step 3',
    name: 'LinkedIn Goals',
    fields: ['linkedInGoal'],
    // fields: [],
  },
  {
    id: 'Step 4',
    name: 'LinkedIn Topics',
    fields: ['linkedInTopics'],
    // fields: [],
  },
  {
    id: 'Step 5',
    name: 'Post Tone',
    fields: ['postTone'],
    // fields: [],
  },
  {
    id: 'Step 6',
    name: 'Target Audience',
    // fields: [],
    fields: ['targetAudience', 'otherTargetAudience'],
  },
  {
    id: 'Step 7',
    name: 'Company URL',
    // fields: [],
    fields: ['companyUrl'],
  },
];

export default function OnboardingProgressButtons({
  currStep,
  onSubmit,
}: Props) {
  const form = useFormContext<TOnboardingForm>();
  const router = useRouter();
  const posthog = usePostHog();

  const { t } = useTranslation('onboarding');

  const isContinueDisabled = useIsContinueDisabled(currStep);

  const onContinue = useCallback(
    async (currStep: number) => {
      if (currStep === 0) {
        form.reset();
        router.push('?step=1', { scroll: false });
        return;
      }
      const fields = steps[currStep - 1].fields as FormField[];
      const validated = await form.trigger(fields, { shouldFocus: true });
      if (!validated) {
        toast.error('Please make sure all fields are filled');
        return;
      }
      if (currStep < steps.length) {
        // localStorage.setItem('onboarding-values', JSON.stringify(formValues));
        posthog.capture(`reached step ${currStep + 1}`, {
          step: currStep + 1,
        });
        router.push(`?step=${currStep + 1}`);
      } else {
        form.handleSubmit(
          (data) => onSubmit(data),
          () => toast.error('Please make sure all fields are filled')
        )();
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, onSubmit, router]
  );

  const onBack = useCallback(() => {
    const prevStep = Math.max(currStep - 1, 1);
    router.push(`?step=${prevStep}`);
  }, [currStep, router]);

  return (
    <div className='fixed bottom-0 w-full items-center self-center border-t bg-white/20 px-2 py-4 backdrop-blur-2xl'>
      <div className='mx-auto flex h-12 gap-1 sm:max-w-sm'>
        <Button
          onClick={onBack}
          size='icon'
          variant='outline'
          className={cn(
            'aspect-square h-full w-max rounded-lg border text-[#1877F2] shadow-sm hover:cursor-pointer ',
            {
              hidden: currStep === 1,
            }
          )}
        >
          <PiCaretLeft className='h-6 w-6 text-primary' />
          <span className='sr-only'>
            <Trans i18nKey='onboarding:backButton' />
          </span>
        </Button>
        <Button
          disabled={isContinueDisabled}
          onClick={() => onContinue(currStep)}
          className='h-full grow rounded-lg border border-primary bg-[#1877F2] px-4 text-lg font-medium text-white shadow-sm hover:cursor-pointer hover:border-[#1877F2] hover:bg-[#DEEDFF] hover:text-[#1877F2]'
        >
          {currStep < 7
            ? t('onboarding:continueButton')
            : t('onboarding:finishButton')}
        </Button>
      </div>
    </div>
  );
}
