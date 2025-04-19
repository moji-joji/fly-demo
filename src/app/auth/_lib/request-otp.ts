import { createClient } from '@/services/supabase/client';

export async function requestOtp(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    console.error(error);
    throw error;
  }
}
