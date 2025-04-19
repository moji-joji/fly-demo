import { createClient } from '@/services/supabase/client';

export async function verifyOtp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error) {
    console.error(error);
    throw error;
  }
}
