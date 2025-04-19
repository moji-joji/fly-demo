'use server';

import { createClient as createAdminClient } from '@/services/supabase/admin';
import { createClient } from '@/services/supabase/server';

import generateInspirations from './generate-inspirations';
import TInspiration from '../type';

export default async function generateMoreInspirations(): Promise<
  TInspiration[]
> {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .single();

  if (profileError) {
    throw new Error('User profile not found');
  }

  // check if all the required fields are present
  const {
    companyName,
    role,
    linkedinGoals,
    linkedinTopics,
    postTone,
    targetAudience,
    companyUrl,
  } = profile;

  if (
    !companyName ||
    !role ||
    !linkedinGoals ||
    !linkedinTopics ||
    !postTone ||
    !targetAudience ||
    !companyUrl
  ) {
    throw new Error('User profile is incomplete');
  }

  const { data: allowed, error: allowedError } =
    await supabase.rpc('check_credit');

  if (allowedError) {
    throw allowedError;
  }

  if (!allowed) {
    throw new Error('Not enough credits');
  }

  // fetch the users previously generated inspirations
  let alreadyGeneratedInspirations;

  const { data: generatedInspirations, error: fetchError } = await supabase
    .from('inspirations')
    .select('text,category,isSaved')
    .order('createdAt', { ascending: false });

  if (fetchError) {
    alreadyGeneratedInspirations = undefined;
  } else {
    alreadyGeneratedInspirations = {
      saved: generatedInspirations
        .filter((inspiration) => inspiration.isSaved)
        .map((insp) => ({ inspiration: insp.text, theme: insp.category })),
      others: generatedInspirations
        .slice(0, 3)
        .map((insp) => ({ inspiration: insp.text, theme: insp.category })),
    };
  }

  // generate inspirations
  const inspirations = (
    await generateInspirations({
      companyName,
      role,
      linkedInGoals: linkedinGoals,
      linkedInTopics: linkedinTopics,
      postTone,
      targetAudience,
      companyUrl,
      companyData: profile.companyData || 'No company info available',
      alreadyGeneratedInspirations,
      language: 'English',
    })
  ).map((inspiration) => ({
    text: inspiration.inspiration,
    category: inspiration.theme,
  }));

  // save inspirations to database
  const { data: insertedInspirations, error: insertError } = await supabase
    .from('inspirations')
    .insert(inspirations)
    .select('id,text,category,createdAt,isSaved')
    .order('createdAt', { ascending: false })
    .order('id', { ascending: false });

  if (insertError) {
    throw insertError;
  }

  // update the users credits
  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin.rpc('subtract_credit', {
    user_id: profile.id,
  });

  if (error) {
    console.error(error);
  }

  return insertedInspirations;
}
