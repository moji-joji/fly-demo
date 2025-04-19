'use client';

import { LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiCaretDown, PiUserFill } from 'react-icons/pi';

import useAccount from '@/lib/account/use-account';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { createClient } from '@/services/supabase/client';

import LanguageSelector from './language-selector';
import { useQueryClient } from '@tanstack/react-query';
import { usePostHog } from 'posthog-js/react';
import * as Sentry from '@sentry/nextjs';

type Props = {};

export default function Profile({}: Props) {
  const account = useAccount();
  const { t } = useTranslation('app');
  const router = useRouter();
  const queryClient = useQueryClient();
  const posthog = usePostHog();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/auth');
    queryClient.clear();
    posthog.reset();
    Sentry.setUser(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='mb-3 flex gap-2 rounded-md border-primary/30 bg-primary/5 p-[0.0625rem] px-3 text-left font-normal shadow-sm shadow-primary/5 hover:border-primary/70 hover:bg-primary/5'
        >
          {!account.data?.avatar ? (
            <PiUserFill className='h-5 w-5 rounded-full bg-slate-300 p-1' />
          ) : (
            <Image
              src={account.data?.avatar}
              alt='Profile Picture'
              width={20}
              height={20}
              className='aspect-square rounded-full object-cover'
            />
          )}

          <span className='min-w-0 flex-1 truncate text-sm'>
            {account.data?.email}
          </span>
          <PiCaretDown className='h-3 w-3 shrink-0' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='w-[var(--radix-dropdown-menu-trigger-width)]'
      >
        <DropdownMenuLabel className='text-sm font-normal'>
          {account.data?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/dashboard/settings'>
            <Settings className='mr-1.5 h-3.5 w-3.5' />
            {t('settings')}
          </Link>
        </DropdownMenuItem>

        <LanguageSelector />
        <DropdownMenuItem onClick={logout}>
          <LogOut className='mr-1.5 h-3.5 w-3.5' />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
