'use client';
import Link from 'next/link';

import useAccount from '@/lib/account/use-account';

import { Trans } from '../ui/trans';

export default function CreditsBanner() {
  const { data } = useAccount();

  if (data && data.credits <= 0) {
    return (
      <div className='fixed left-0 top-0 z-50 w-full bg-primary py-1 text-center text-sm text-white '>
        {data.planType === 'Free' && data.credits <= 0 ? (
          <p>
            <Trans i18nKey='app:creditsBannerNotif' />
            <Link
              href={`/api/stripe/create-session?priceId=${process.env.NEXT_PUBLIC_STRIPE_ONE_MONTH_PRICE_ID}`}
            >
              <span className='ml-2 font-semibold text-white underline'>
                <Trans i18nKey='app:creditsBannerCTA' />
              </span>
            </Link>
          </p>
        ) : (
          <p className='text-center'>
            <Trans i18nKey='app:proCreditsFinished' />
          </p>
        )}
      </div>
    );
  } else {
    return (
      <div className='fixed left-0 top-0 z-50 w-full bg-primary py-1 text-center text-sm text-white '>
        <p>
          <Trans i18nKey='app:bookCallNotif' />
          <Link href={`https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0bTcSOGSI3-28uKlztmeBBH00YFTO10kqs8w0TrQMzmwfKBQhtWmDojbyW5GKStc0aIvUG1wUE`}>
            <span className='ml-2 font-semibold text-white underline'>
              <Trans i18nKey='app:bookCallCTA' />
            </span>
          </Link>
        </p>
      </div>
    );
  }
}
