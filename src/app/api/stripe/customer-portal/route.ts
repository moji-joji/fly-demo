import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { isLoggedIn } from '@/lib/is-logged-in';

import { createClient } from '@/services/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: '2024-06-20',
});

export const dynamic = 'force-dynamic';

export const GET = isLoggedIn(async ({ user }) => {
  try {
    const supabase = createClient();

    const { data: accountData, error: accountError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (accountError) {
      return NextResponse.json(
        { error: 'INTERNAL SERVER ERROR' },
        { status: 500 }
      );
    }

    if (!accountData?.stripeCustomerId)
      return NextResponse.json(
        { error: 'CUSTOMER NOT FOUND' },
        { status: 404 }
      );

    const return_url = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

    // If the user does not have a Stripe customer ID, create one.
    const session = await stripe.billingPortal.sessions.create({
      customer: accountData.stripeCustomerId,
      return_url,
    });

    return NextResponse.redirect(session.url as string, { status: 302 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'INTERNAL SERVER ERROR' },
      { status: 500 }
    );
  }
});
