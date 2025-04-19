'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import useAccount from '@/lib/account/use-account';

import BannerLarge from '@/components/hypecut/banner-large';
import GeneratedInspirations from '@/components/inspirations/generated-inspirations';
import SavedInspirations from '@/components/inspirations/saved-inspirations';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import NewPostInput from '../../components/new-post-input';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Dashboard({ searchParams }: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const [input, setInput] = useState('');
  const router = useRouter();
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);

  const showTutorial = searchParams.tutorial === 'true';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (account.data?.credits === 0) {
      toast.error(t('app:noCreditsError'));
      return;
    }

    const urlParams = new URLSearchParams({
      m: input,
    });
    router.push(`/dashboard/create?${urlParams.toString()}`);
  };

  useEffect(() => {
    if (showTutorial) setShowTutorialPopup(true);
  }, [showTutorial]);

  return (
    <div className='mx-auto max-w-4xl 2xl:max-w-5xl px-2 py-6'>
      <TutorialDialog
        showTutorialPopup={showTutorialPopup}
        setShowTutorialPopup={setShowTutorialPopup}
      />
      <h1 className='text-center text-4xl font-bold text-black-1'>
        Hi {account.data?.name ?? 'there'}!
      </h1>

      <NewPostInput
        value={input}
        handleInputChange={(e: any) => setInput(e.target.value)}
        onSubmit={onSubmit}
        className='mt-6'
        placeholder={t('dashboard:newPostPlaceholder')}
      />
      <div className='mt-3'>
        <GeneratedInspirations />
      </div>
      <BannerLarge className='mt-3' />
      <div className='mt-3'>
        <SavedInspirations />
      </div>
    </div>
  );
}

function TutorialDialog({
  showTutorialPopup,
  setShowTutorialPopup,
}: {
  showTutorialPopup: boolean;
  setShowTutorialPopup: (value: boolean) => void;
}) {
  const router = useRouter();
  const onOpenChange = (value: boolean) => {
    if (!value) router.push('/dashboard');

    setShowTutorialPopup(value);
  };

  return (
    <Dialog open={showTutorialPopup} onOpenChange={onOpenChange}>
      <DialogContent className='flex w-fit max-w-none items-end justify-end rounded-md pt-10'>
        {/* embed youtube video here */}
        <iframe
          src='https://www.youtube.com/embed/SuHUZ2Jlzr4?si=C6v99J0TMMqV4rCY'
          title='YouTube video player'
          className='aspect-video w-[20rem] rounded-md border-0 sm:w-[40rem] lg:w-[50rem]'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        ></iframe>
      </DialogContent>
    </Dialog>
  );
}
