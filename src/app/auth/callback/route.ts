import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

import { createClient } from '@/services/supabase/server';
import { brevo } from '@/services/brevo';
import LoopsService from '@/services/loops';

const loopsService = new LoopsService();

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // check if data.user.created_at is in the last minute, this is kind of
      // of a hack to check if this is a new signup vs a returning user
      if (
        Date.now() - new Date(data.user.created_at).getTime() < 60000 &&
        data.user.email
      ) {
        await brevo.createContact(data.user.email);
        await loopsService.signup(data.user.id, data.user.email);
      }
      redirect(next);
    }
    console.error(error);
  }

  // return the user to an error page with instructions
  redirect(`${origin}/auth/error`);
}
