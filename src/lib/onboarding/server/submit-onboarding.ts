'use server';

import generateInspirations from '@/lib/inspirations/server/generate-inspirations';

import { createClient } from '@/services/supabase/server';

import scrapeCompanyUrl from './scrape-company-url';
import {
  onboardingFormSchema,
  TOnboardingForm,
} from '../onboarding.form.schema';

import posthog from '@/services/posthog/server';
import { brevo } from '@/services/brevo';
import LoopsService from '@/services/loops';

const loopsService = new LoopsService();

export default async function submitOnboarding(_data: TOnboardingForm) {
  const data = onboardingFormSchema.parse(_data);

  const { text: companyInfo, error: scrapeError } = await scrapeCompanyUrl(
    data.companyUrl
  );

  if (scrapeError) throw scrapeError;

  // Replace the values of "Other" or "Andere" in "role" with the value of "otherRole"

  if ((data.role === 'Other' || data.role === 'Andere') && data.otherRole) {
    data.role = data.otherRole;
  }

  // In the data.targetAudience array, if there exists "Other" or "Andere", replace it with the value of "otherTargetAudience"
  if (
    data.targetAudience.includes('Other') ||
    data.targetAudience.includes('Andere')
  ) {
    if (data.otherTargetAudience) {
      data.targetAudience = data.targetAudience.map((audience) =>
        audience === 'Other' || audience === 'Andere'
          ? data.otherTargetAudience!
          : audience
      );
    }
  }
  const supabase = createClient();

  const { data: user, error: updateError } = await supabase
    .from('profiles')
    .update({
      linkedinGoals: data.linkedInGoals,
      linkedinTopics: data.linkedInTopics,
      postTone: data.postTone,
      targetAudience: data.targetAudience,
      companyName: data.companyName,
      companyUrl: data.companyUrl,
      name: data.firstName + ' ' + data.lastName,
      role: data.role,
      hasOnboarded: true,
      companyData: companyInfo,
    })
    .select('email, id')
    .single();

  // This should never happen, there should be an
  // entry in profiles for every user because of a trigger
  if (updateError) throw updateError;

  const inspirations = await generateInspirations({
    ...data,
    companyData: companyInfo || 'No company info available',
  });

  // store inspirations in the database
  const { error: insertError } = await supabase.from('inspirations').insert(
    inspirations.map((inspiration) => ({
      category: inspiration.theme,
      text: inspiration.inspiration,
    }))
  );

  if (insertError) throw insertError;

  // update the user's metadata to mark onboarding as complete
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { onboarding: 'complete' },
  });

  if (metadataError) throw metadataError;

  await brevo.updateContact(user.email, true);
  await loopsService.trackOnboarded(user.email, data);

  // Add the analytics to posthog
  posthog.capture({
    distinctId: user.id,
    event: 'onboarding completed',
    properties: {
      $set: {
        email: user.email,
        has_onboarded: true,
      },
    },
  });

  await posthog.shutdown();
}
