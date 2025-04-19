'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PiArrowUpRight } from 'react-icons/pi';

import useAccount from '@/lib/account/use-account';
import { FREE_CREDITS, PRO_CREDITS } from '@/lib/const';
import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trans } from '@/components/ui/trans';

export default function PlanDetails() {
  const { data, isPending, isError } = useAccount();
  const { t } = useTranslation('app');
  if (isPending) return null;

  if (isError) return null;

  const totalCredits = data.planType === 'Free' ? FREE_CREDITS : PRO_CREDITS;
  const usedCredits = totalCredits - data.credits;

  return (
    <div className='mb-3 space-y-4 rounded-md bg-[#000641] p-4 text-white'>
      <h4 className='text-lg font-semibold'>
        <Trans i18nKey='app:planDetails' />
      </h4>

      <div className='space-y-1'>
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
          data.planType === 'Free'
            ? `/api/stripe/create-session?priceId=${process.env.NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID}`
            : '/api/stripe/customer-portal'
        }
        className={cn(buttonVariants({ size: 'sm' }), '')}
      >
        <PiArrowUpRight className='mr-1 text-xl' />
        <span className='text-sm'>
          {data.planType === 'Free'
            ? t('app:upgradePlan')
            : t('app:manageSubscription')}
        </span>
      </Link>
    </div>
  );
}
