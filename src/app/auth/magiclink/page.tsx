'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Trans } from '@/components/ui/trans';

import { requestOtp } from '../_lib/request-otp';
import { verifyOtp as verifyOtpFn } from '../_lib/verify-otp';

import attherate from '~/images/attherate.png';
import bgGradient from '~/images/gradient.png';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function MagicLink({ searchParams }: Props) {
  const userEmail = String(searchParams.email);
  const [otp, setOtp] = useState('');

  const router = useRouter();

  const verifyOtp = useMutation({
    mutationKey: ['verify-otp'],
    mutationFn: verifyOtpFn,
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resendOtp = useMutation({
    mutationKey: ['resend-otp'],
    mutationFn: requestOtp,
    onSuccess: () => {
      toast.success('OTP sent successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <main>
      <Image
        src={bgGradient}
        alt='Gradient'
        fill
        className='object-cover object-center'
        placeholder='blur'
        quality={50}
      />

      <div className='relative z-10 grid h-screen w-screen place-content-center'>
        <div
          style={{
            boxShadow: '-2px 0px 30px 0px rgba(67, 67, 67, 0.20)',
          }}
          className='max-w-md rounded-3xl border-[#DEEDFF] border-[3] bg-white px-16 py-6 text-center'
        >
          <Image
            src={attherate}
            alt='@'
            width={150}
            height={150}
            className='mx-auto'
          />
          <h2 className='mt-3 text-4xl font-bold text-black-1'>
            <Trans i18nKey='auth:checkYourEmail' />
          </h2>
          <p className='mt-3'>
            <Trans i18nKey='auth:otpSent' />
          </p>

          <div className='my-3 flex flex-col items-center justify-center gap-2'>
            <InputOTP className='' value={otp} onChange={setOtp} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />

                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              disabled={verifyOtp.isPending}
              onClick={() => verifyOtp.mutate({ email: userEmail, otp })}
            >
              {verifyOtp.isPending && (
                <Loader className='mr-2 h-4 w-4 animate-spin' />
              )}
              <Trans i18nKey='auth:verify' />
            </Button>
          </div>

          <p className='text-sm text-grey-2'>
            <Trans i18nKey='auth:didntReceiveCode' />
            <Button
              disabled={resendOtp.isPending}
              onClick={() => resendOtp.mutate(userEmail)}
              variant='link'
              className='px-1 py-0 text-blue-4'
            >
              <Trans i18nKey='auth:resend' />
            </Button>
          </p>
        </div>
      </div>
    </main>
  );
}
