import { User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { createClient } from '@/services/supabase/server';

type LoggedInHandler<T> = (ctx: {
  req: NextRequest;
  user: User;
  options: T;
}) => NextResponse | Promise<NextResponse>;

export function isLoggedIn<T>(handler: LoggedInHandler<T>) {
  return async (request: NextRequest, options?: unknown) => {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user)
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_SITE_URL}/auth`
        );

      return handler({
        req: request,
        user,
        options: options as T,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
