import OnboardingFormContainer from '@/components/onboarding/common/onboarding-form-container';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export const maxDuration = 100;

const TestingPage = ({ searchParams }: Props) => {
  const currStep = parseInt((searchParams['step'] as string) || '1', 10);

  return <OnboardingFormContainer currStep={currStep} />;
};

export default TestingPage;
