import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PiArrowUpRight, PiCheckCircle } from 'react-icons/pi';

import { FREE_CREDITS, PRO_CREDITS } from '@/lib/const';

import { Progress } from '../ui/progress';
import { Trans } from '../ui/trans';

import { Enums } from '@/types/database.types';

type BillingSectionProps = {
  planType: Enums<'Plan Type'>;
  credits: number;
  stripeCustomerId?: string | null;
};

type PlanCardProps = {
  planType: Enums<'Plan Type'>;
  credits: number;
  stripeCustomerId?: string | null;
};

export default function BillingSection({
  planType,
  credits,
  stripeCustomerId,
}: BillingSectionProps) {
  return (
    <div className='space-y-10 md:max-w-3xl'>
      <PlanCard
        planType={planType}
        credits={credits}
        stripeCustomerId={stripeCustomerId}
      />
      {planType === 'Free' && <ProCard planType={planType} />}
    </div>
  );
}

function PlanCard({ planType, credits, stripeCustomerId }: PlanCardProps) {
  // credit calculation
  const totalCredits = planType === 'Free' ? FREE_CREDITS : PRO_CREDITS;
  const usedCredits = totalCredits - credits;
  const { t } = useTranslation('app');

  return (
    <div className='mt-4 rounded-lg  bg-[#000641] text-white'>
      <div className='w-1/2 space-y-6 px-10 py-6'>
        <div className='space-y-2'>
          <h4 className='mb-2'>
            <Trans i18nKey="app:currentPlan" />
            {planType === 'Free' ? 'Free Plan' : 'Pro Plan'}
          </h4>
          <p className='text-sm'>
            <Trans i18nKey="app:creditsUsed" />
          </p>
          <Progress value={(usedCredits / totalCredits) * 100} />
          <p className='text-xs text-[#828282]'>
            {usedCredits} {usedCredits === 1 ? 'credit' : 'credits'}{' '}
            <Trans i18nKey="app:outOf" /> {totalCredits}{' '}
            <Trans i18nKey="app:used" />
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
            href="/api/stripe/customer-portal"
            className='flex w-fit items-center  gap-2  py-2 underline  hover:opacity-90'
          >
            <span className=''>
              <Trans i18nKey="app:openCustomerPortal" />
            </span>
          </Link>
        )}
      </div>
      <div className='relative'>
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
    <div className='space-y-4 rounded-lg border border-[#1877F2] px-10 py-6 pb-16'>
      <h2 className='text-2xl font-bold'>
        <Trans i18nKey="app:5xPro" />
      </h2>
      <Link
        href={
          planType === 'Free'
            ? `/api/stripe/create-session?priceId=${process.env.NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID}`
            : '/api/stripe/customer-portal'
        }
        className='flex w-fit items-center  gap-2 rounded-md bg-[#1877F2] px-2 py-2 text-white  hover:opacity-90'
      >
        <Trans i18nKey="app:subscribeNow" />
      </Link>
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
    </div>
  );
}
