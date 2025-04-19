import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createClient } from '@/services/supabase/admin';
import posthog from '@/services/posthog/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: '2024-06-20',
});

export const POST = async (req: NextRequest) => {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    const buf = await req.text();
    const signature = req.headers.get('stripe-signature') as string;
    const supabase = createClient();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    if (event.type === 'customer.deleted') {
      const customer = event.data.object as Stripe.Customer;

      const { data: userId, error: userIdError } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripeCustomerId', customer.id)
        .single();

      if (userIdError) {
        return NextResponse.json(
          { error: 'No profile with this stripe id' },
          { status: 500 }
        );
      }

      const { data: users, error: userError } = await supabase
        .from('profiles')
        .update({ stripeCustomerId: null, subscriptionId: null })
        .eq('userId', userId.id);

      if (userError) {
        return NextResponse.json(
          { error: 'INTERNAL SERVER ERROR' },
          { status: 500 }
        );
      }

      const expDate = new Date();
      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .update({
          proPlanExpirationDate: expDate.toISOString(),
          planType: 'Free',
          credits: 10,
        })
        .eq('userId', userId.id);

      if (creditsError) {
        return NextResponse.json(
          { error: 'Error Deleting Stripe Customer' },
          { status: 500 }
        );
      }
    } else if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId as string;

      const { data: cusId, error: cusIdError } = await supabase
        .from('profiles')
        .update({
          stripeCustomerId: subscription.customer as string,
          subscriptionId: subscription.id,
        })
        .eq('id', userId);

      if (cusIdError) {
        return NextResponse.json(
          { error: 'Insert error on stripeCustomerId in profiles table' },
          { status: 500 }
        );
      }
      // expires in 30 days
      const expiresAt = new Date(subscription.current_period_end * 1000);

      const { data: expDate, error: expDateError } = await supabase
        .from('credits')
        .update({
          proPlanExpirationDate: expiresAt.toISOString(),
          planType: 'Pro',
          credits: 100,
        })
        .eq('userId', userId);

      if (expDateError) {
        return NextResponse.json(
          { error: 'Insert error on proPlanExpirationDate in credits table' },
          { status: 500 }
        );
      }

      posthog.capture({
        distinctId: userId,
        event: 'subscribed pro',
      });

      await posthog.shutdown();
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;

      if (subscription.cancel_at) {
        const expiresAt = new Date(subscription.cancel_at * 1000);
        const { data: expDate, error: expDateError } = await supabase
          .from('credits')
          .update({
            proPlanExpirationDate: expiresAt.toISOString(),
          })
          .eq('userId', subscription.metadata.userId as string);

        if (expDateError) {
          return NextResponse.json(
            { error: 'Insert error on proPlanExpirationDate in credits table' },
            { status: 500 }
          );
        }
      } else {
        const expiresAt = new Date(subscription.current_period_end * 1000);

        const { data: expDate, error: expDateError } = await supabase
          .from('credits')
          .update({
            proPlanExpirationDate: expiresAt.toISOString(),
            planType: 'Pro',
            credits: 100,
          })
          .eq('userId', subscription.metadata.userId as string);

        if (expDateError) {
          return NextResponse.json(
            {
              error: 'Insert error on proPlanExpirationDate in credits table',
            },
            { status: 500 }
          );
        }

        const { data: subId, error: subIdError } = await supabase
          .from('profiles')
          .update({
            subscriptionId: subscription.id,
          })
          .eq('stripeCustomerId', subscription.customer as string);

        if (subIdError) {
          return NextResponse.json(
            { error: 'Insert error on subscriptionId in profiles table' },
            { status: 500 }
          );
        }
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;

      const { data: subId, error: subIdError } = await supabase
        .from('profiles')
        .update({
          subscriptionId: null,
        })
        .eq('stripeCustomerId', subscription.customer as string);

      if (subIdError) {
        return NextResponse.json(
          { error: 'Insert error on subscriptionId in profiles table' },
          { status: 500 }
        );
      }
      const expiresAt = new Date();
      const { data: expDate, error: expDateError } = await supabase
        .from('credits')
        .update({
          proPlanExpirationDate: expiresAt.toISOString(),
          planType: 'Free',
          credits: 10,
        })
        .eq('userId', subscription.metadata.userId as string);
    } else {
      console.log('Unhandled event type', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
