import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { parse } from 'url';

import { isLoggedIn } from '@/lib/is-logged-in';

import { createClient } from '@/services/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: '2024-06-20',
});

export const GET = isLoggedIn(async ({ req, user }) => {
  try {
    const supabase = createClient();
    const { query } = parse(req.url, true);

    const { priceId } = query;

    if (!priceId) {
      return NextResponse.json({ error: 'MISSING PRICE ID' }, { status: 400 });
    }

    const userId = user.id;
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { message: 'Failed to find user' },
        { status: 500 }
      );
    }
    if (userData.stripeCustomerId) {
      const subscription = await stripe.subscriptions.list({
        customer: userData.stripeCustomerId,
        status: 'active',
      });
      if (subscription.data.length > 0) {
        return NextResponse.json(
          { error: 'USER ALREADY SUBSCRIBED' },
          { status: 403 }
        );
      }
    }

    const { data: creditsData, error: creditsError } = await supabase
      .from('credits')
      .select('*')
      .eq('userId', userId)
      .single();

    if (creditsError) {
      return NextResponse.json(
        { error: 'INTERNAL SERVER ERROR' },
        { status: 500 }
      );
    }

    if (creditsData.planType === 'Pro') {
      return NextResponse.json(
        { error: 'USER ALREADY SUBSCRIBED FOR THIS MONTH' },
        { status: 403 }
      );
    }

    const success_url = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`;
    const cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=failed`;
    // If the user does not have a Stripe customer ID, create one.
    const stripeSession = await stripe.checkout.sessions.create({
      customer: userData.stripeCustomerId ?? undefined,
      success_url,
      cancel_url,
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: userData.stripeCustomerId ? undefined : user.email,
      allow_promotion_codes: true,
      customer_update: userData.stripeCustomerId
        ? {
            address: 'auto',
            shipping: 'auto',
          }
        : undefined,
      subscription_data: { metadata: { userId: user.id } },
      line_items: [
        {
          quantity: 1,
          price: priceId as string,
        },
      ],
    });

    return NextResponse.redirect(stripeSession.url as string, { status: 303 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'INTERNAL SERVER ERROR' },
      { status: 500 }
    );
  }
});
