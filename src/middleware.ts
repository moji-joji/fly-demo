import { NextRequest } from 'next/server';

import { updateSession } from '@/services/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!api/stripe|_next/static|_next/image|ingest|favicon|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|brevo\\.js$).*)',
    '/',
  ],
};
