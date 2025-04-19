'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PiArrowUpRight, PiCheckCircle } from 'react-icons/pi';

import { FREE_CREDITS, PRO_CREDITS } from '@/lib/const';

import { Enums } from '@/types/database.types';
import { Trans } from '@/components/ui/trans';
import { Progress } from '@/components/ui/progress';
import useAccount from '@/lib/account/use-account';
import LoadingAnimation from '@/components/loading-animation';
import ErrorScreen from '@/components/error-screen';
import SectionCard from './section-card';
import { buttonVariants } from '@/components/ui/button';

type PlanCardProps = {
  planType: Enums<'Plan Type'>;
  credits: number;
  stripeCustomerId?: string | null;
};

export default function BillingInfo() {
  const account = useAccount();
  const { t } = useTranslation('app');
  if (account.isPending) return null;

  if (account.error) return <ErrorScreen />;

  return (
    <SectionCard className='w-full xl:w-1/2' title={t('billing')}>
      <PlanCard
        planType={account.data.planType}
        credits={account.data.credits}
        stripeCustomerId={account.data.stripeCustomerId}
      />
      {account.data.planType === 'Free' && (
        <ProCard planType={account.data.planType} />
      )}
    </SectionCard>
  );
}

function PlanCard({ planType, credits, stripeCustomerId }: PlanCardProps) {
  // credit calculation
  const totalCredits = planType === 'Free' ? FREE_CREDITS : PRO_CREDITS;
  const usedCredits = totalCredits - credits;
  const { t } = useTranslation('app');

  return (
    <div className='rounded-lg bg-[#000641] text-white'>
      <div className='relative z-10 bg-transparent w-full space-y-6 p-5 xl:px-7'>
        <div className='space-y-2'>
          <h4 className='mb-2'>
            <Trans i18nKey='app:currentPlan' />
            {planType === 'Free' ? 'Free Plan' : 'Pro Plan'}
          </h4>
          <p className='text-sm'>
            <Trans i18nKey='app:creditsUsed' />
          </p>
          <Progress value={(usedCredits / totalCredits) * 100} />
          <p className='text-xs text-[#828282]'>
            {usedCredits} {usedCredits === 1 ? 'credit' : 'credits'}{' '}
            <Trans i18nKey='app:outOf' /> {totalCredits}{' '}
            <Trans i18nKey='app:used' />
          </p>
        </div>
        <Link
          href={
            planType === 'Free'
              ? `/api/stripe/create-session?priceId=${process.env.NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID}`
              : '/api/stripe/customer-portal'
          }
          className='flex w-fit items-center  gap-2 rounded-md bg-[#1877F2] px-2 py-2  hover:opacity-90'
        >
          <PiArrowUpRight className='text-xl' />
          <span className='text-sm'>
            {planType === 'Free'
              ? t('app:upgradePlan')
              : t('app:manageSubscription')}
          </span>
        </Link>
        {stripeCustomerId && (
          <Link
            href='/api/stripe/customer-portal'
            className='flex w-fit items-center  gap-2  py-2 underline  hover:opacity-90'
          >
            <span className=''>
              <Trans i18nKey='app:openCustomerPortal' />
            </span>
          </Link>
        )}
      </div>
      <div className='relative hidden xl:block'>
        <Image
          alt='Blue circle'
          src='/images/blue-quarter-circle.png'
          width={180}
          height={180}
          className='absolute bottom-0 right-0 overflow-clip rounded-br-lg'
        />
      </div>
    </div>
  );
}

function ProCard({ planType }: { planType: string }) {
  const { t } = useTranslation('app');
  const featuresList = [
    t('app:proFeat1'),
    t('app:proFeat2'),
    t('app:proFeat3'),
    t('app:proFeat4'),
    t('app:proFeat5'),
  ];

  return (
    <div className='mt-4 flex flex-col gap-4 rounded-lg'>
      <h2 className='text-2xl font-bold'>
        <Trans i18nKey='app:5xPro' />
      </h2>
      <ul className=''>
        {featuresList.map(
          (feature, index) =>
            feature && (
              <li key={index} className='flex items-center gap-2'>
                <PiCheckCircle className='text-xl text-[#828282]' />

                <span className='text-[#565656]'>{feature}</span>
              </li>
            )
        )}
      </ul>
      <Link
        href={
          planType === 'Free'
            ? `/api/stripe/create-session?priceId=${process.env.NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID}`
            : '/api/stripe/customer-portal'
        }
        className={buttonVariants({ className: 'w-fit self-end' })}
      >
        <Trans i18nKey='app:subscribeNow' />
      </Link>
    </div>
  );
}
