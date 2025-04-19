'use client';

import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Trans } from '@/components/ui/trans';

import { createClient } from '@/services/supabase/client';
import Link from 'next/link';

type Props = {};

const socialLogins = [
  {
    provider: 'google',
    i18nKey: 'signInWithGoogle',
    icon: FcGoogle,
  },
  {
    provider: 'linkedin_oidc',
    i18nKey: 'signInWithLinkedin',
    icon: FaLinkedin,
  },
] as const;

export default function AuthForm({}: Props) {
  // const { t } = useTranslation();

  const socialLogin = useMutation({
    mutationFn: async (provider: (typeof socialLogins)[number]['provider']) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
    },
    onError: () => {
      toast.error('We could not sign you in. Please try again.');
    },
  });

  return (
    <>
      <div className='mx-auto max-w-sm'>
        <h3 className='text-2xl font-semibold'>
          <Trans i18nKey='auth:signupToYourAccount' />
        </h3>

        {socialLogins.map((social) => (
          <Button
            key={social.provider}
            disabled={socialLogin.isPending}
            className='mt-3 w-full bg-white font-medium text-[#344054] hover:bg-white/70'
            onClick={() => socialLogin.mutate(social.provider)}
          >
            <social.icon size={20} className='mr-2 inline-block' />
            <Trans i18nKey={`auth:${social.i18nKey}`} />
          </Button>
        ))}

        <p className='mt-2 text-center text-xs text-[#828282]'>
          <Trans i18nKey='auth:termsExplanation'>
            By signing up, you agree to our
            <Link
              className='underline'
              target='_blank'
              href='https://statuesque-argument-98c.notion.site/Privacy-Policy-55bca01e61034a338db316fd2773807c'
            >
              Privacy Policy
            </Link>
          </Trans>
        </p>
      </div>
    </>
  );
}
