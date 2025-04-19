'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  PiArrowSquareOut,
  PiChatTeardropText,
  PiCircleNotch,
  PiSmiley,
  PiSmileyMeh,
  PiSmileySad,
} from 'react-icons/pi';
import { z } from 'zod';

import useAccount from '@/lib/account/use-account';
import { cn } from '@/lib/utils';

import { createClient } from '@/services/supabase/client';

import { Button, buttonVariants } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Textarea } from '../../ui/textarea';
import { Trans } from '../../ui/trans';

import hypecutLogo from '~/images/hypecut.png';
import hypecutDesc from '~/images/hypecut-desc.png';

export default function PostFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const account = useAccount();

  if (account.isPending) return null;
  if (account.isError) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className='flex items-center gap-2 rounded-md border border-transparent p-[0.0625rem] text-[#565656]'>
        <PiChatTeardropText className='h-7 w-7 text-[#565656]' />
        <span className=''>
          <Trans i18nKey='app:submitFeedback' />
        </span>
      </DialogTrigger>

      <FeedbackForm onOpenChange={setIsOpen} />
    </Dialog>
  );
}

const feedbackRatingEmojis = {
  1: {
    colorClass: 'bg-red-500',
    emoji: PiSmileySad,
  },
  2: {
    colorClass: 'bg-yellow-500',
    emoji: PiSmileyMeh,
  },
  3: {
    colorClass: 'bg-green-500',
    emoji: PiSmiley,
  },
} as const;

const feedBackFormSchema = z.object({
  feedbackRating: z.number().min(1).max(3),
  feedbackText: z.string().min(1).max(500).optional(),
});

type TFeedbackForm = z.infer<typeof feedBackFormSchema>;

function FeedbackForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<'feedback' | 'hypecut'>('feedback');
  const form = useForm<TFeedbackForm>({
    resolver: zodResolver(feedBackFormSchema),
  });

  const queryClient = useQueryClient();

  const submitFeedback = useMutation({
    mutationKey: ['submit-feedback'],
    mutationFn: async (data: TFeedbackForm) => {
      const supabase = createClient();
      const { error } = await supabase.from('feedback').insert({
        rating: data.feedbackRating,
        text: data.feedbackText,
      });
      if (error) throw error;
      const { error: updateError } = await supabase.from('profiles').update({
        feedbackGiven: true,
      });
      if (updateError) throw updateError;
    },
    onSettled(_, __, variables) {
      form.reset();
      if (variables.feedbackRating > 1) {
        setView('hypecut');
      } else {
        onOpenChange(false);
      }
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });

  if (view === 'hypecut') return <Hypecut />;

  return (
    <DialogContent className='max-w-xs'>
      <DialogHeader>
        <DialogTitle className='text-xl'>Feedback</DialogTitle>
      </DialogHeader>
      <div>
        <Form {...form}>
          <form
            className='mt-2'
            onSubmit={form.handleSubmit((data) => submitFeedback.mutate(data))}
          >
            <FormField
              control={form.control}
              name='feedbackRating'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex justify-center gap-5'>
                      {([1, 2, 3] as const).map((rating) => {
                        const Icon = feedbackRatingEmojis[rating].emoji;
                        return (
                          <button
                            key={rating}
                            type='button'
                            onClick={() => field.onChange(rating)}
                            className={`${
                              field.value === rating
                                ? `${feedbackRatingEmojis[rating].colorClass} text-white`
                                : 'bg-gray-200'
                            } rounded-full p-2`}
                          >
                            <Icon className='h-9 w-9' />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='feedbackText'
              render={({ field }) => (
                <FormItem className='mt-2.5'>
                  <FormLabel>
                    <Trans i18nKey='app:suggester' />{' '}
                    <span className='font-normal opacity-60'>(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('app:howCanWeImprove')}
                      className='h-20 resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={submitFeedback.isPending}
              type='submit'
              className='mt-2.5 w-full'
            >
              {submitFeedback.isPending ? (
                <PiCircleNotch className='animate-spin' />
              ) : (
                <Trans i18nKey='app:submit' />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}

function Hypecut() {
  const { t } = useTranslation('app');
  const hypecutPoints = [
    t('app:hypeCutPoint1'),
    t('app:hypeCutPoint2'),
    t('app:hypeCutPoint3'),
  ];
  return (
    <DialogContent className='max-w-xs p-4'>
      <DialogHeader>
        <Image width={100} src={hypecutLogo} alt='Hypecut Logo' />
        <DialogTitle className=''>
          <h3 className='text-center text-2xl'>
            <Trans i18nKey='app:hypecutHeading' />
          </h3>
        </DialogTitle>
      </DialogHeader>
      <div className='flex items-center gap-6'>
        <div>
          <Image
            width={200}
            src={hypecutDesc}
            alt='Hypecut Description'
            className='rounded-lg'
          />
        </div>
        <div>
          <ul className=''>
            {hypecutPoints.map((point, index) => (
              <li
                key={index}
                className='list-disc text-sm leading-snug tracking-tight'
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link
        href='https://thehypecut.com/'
        target='_blank'
        className={cn(buttonVariants(), 'w-full')}
      >
        Hypecut
        <PiArrowSquareOut className='ml-1 h-4 w-4' />
      </Link>
    </DialogContent>
  );
}
