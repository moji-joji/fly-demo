'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  onboardingFormSchema,
  TOnboardingForm,
} from '@/lib/onboarding/onboarding.form.schema';
import submitOnboarding from '@/lib/onboarding/server/submit-onboarding';

import OnboardingProgress from './onboarding-progress';
import OnboardingProgressButtons from './onboarding-progress-buttons';
import Submitting from '../status';
import CompanyUrl from '../steps/company-url';
import Goals from '../steps/goals';
import Role from '../steps/role';
import TargetAudience from '../steps/target-audience';
import Tone from '../steps/tone';
import Topics from '../steps/topics';
import UserDetails from '../steps/user-details';
import { Form } from '../../ui/form';
import { LanguageSelector } from '../language-selector';

import FlyLogo from '/public/svg/fly-logo.svg';
import { Trans } from '@/components/ui/trans';
import { useEffect } from 'react';
import onboardingDefaultValues from '@/lib/onboarding/default-values';

const OnboardingFormContainer = ({ currStep }: { currStep: number }) => {
  const router = useRouter();
  const form = useForm<TOnboardingForm>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: onboardingDefaultValues,
  });

  // check local storage if the user has filled any of the fields
  // this is neccessary because the user might have filled the fields
  // and then refreshed the page.
  // useEffect(() => {
  //   const onboardingValues = localStorage.getItem('onboarding-values');
  //   if (!onboardingValues) return;
  //   form.reset(JSON.parse(onboardingValues));
  // }, [form]);

  const onSubmitOnboarding = useMutation({
    mutationKey: ['submit-onboarding'],
    mutationFn: async (data: TOnboardingForm) => {
      await submitOnboarding(data);
    },
    onSuccess: () => {
      router.push('/dashboard?tutorial=true');
    },
  });

  if (onSubmitOnboarding.status !== 'idle') {
    return (
      <Submitting
        status={onSubmitOnboarding.isError ? 'error' : 'submitting'}
      />
    );
  }

  return (
    <div className='flex h-screen flex-col'>
      <div className='mt-3 flex flex-col items-center text-center md:mt-7'>
        <FlyLogo className='h-[4.875rem] w-[9.25rem]' />
        <h2 className='text-2xl font-semibold text-[#2A2A2A] md:mt-2 md:text-3xl'>
          <Trans i18nKey='onboarding:optimizeToolForYou' />
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex grow flex-col'
        >
          <OnboardingProgress
            className='my-6 mb-7 sm:my-8 md:my-11 lg:mb-14'
            step={currStep}
          />
          <div className='mb-4 w-fit self-center md:absolute md:right-4 md:top-4 md:mb-0'>
            <LanguageSelector />
          </div>
          <div className='pb-32'>
            {currStep === 1 && <UserDetails />}
            {currStep === 2 && <Role />}
            {currStep === 3 && <Goals />}
            {currStep === 4 && <Topics />}
            {currStep === 5 && <Tone />}
            {currStep === 6 && <TargetAudience />}
            {currStep === 7 && <CompanyUrl />}
          </div>
          <OnboardingProgressButtons
            onSubmit={onSubmitOnboarding.mutate}
            currStep={currStep}
          />
        </form>
      </Form>
    </div>
  );
};

export default OnboardingFormContainer;
