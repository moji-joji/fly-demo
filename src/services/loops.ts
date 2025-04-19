import { env } from '@/env';
import { LoopsClient } from 'loops';
import * as Sentry from '@sentry/nextjs';
import { TOnboardingForm } from '@/lib/onboarding/onboarding.form.schema';

export default class LoopsService {
  private client: LoopsClient;

  constructor() {
    this.client = new LoopsClient(env.LOOPS_API_KEY);
  }

  public async signup(userId: string, email: string) {
    const resp = await this.client.updateContact(email, {
      userId,
    });

    if (!resp.success) {
      Sentry.captureException(resp.message);
    }
  }

  public async trackOnboarded(email: string, data: TOnboardingForm) {
    const resp = await this.client.updateContact(email, {
      hasOnboarded: true,
      company: data.companyName,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (!resp.success) {
      Sentry.captureException(resp.message);
    }
  }
}
