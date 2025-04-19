'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Message, useChat } from 'ai/react';
import { useRouter } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import useAccount, { TAccount } from '@/lib/account/use-account';
import { getLastMatching } from '@/lib/utils';

import EditSuggestions from './edit-suggestions';
import PostCanvas from './post-canvas';
import PostHeader from './post-header';
import PostTips from './post-tips';
import NewPostInput from '../new-post-input';
import { usePostHog } from 'posthog-js/react';

// post id with either the inital post or message or nothing
type Props = {
  postId: string;
  initialMessages?: Message[];
  inpirationMessage?: string;
};

export default function Post({ postId, ...props }: Props) {
  const router = useRouter();
  const profile = useAccount();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const posthog = usePostHog();
  const [isManuallyEditing, setIsManuallyEditing] = useState(false);

  const {
    append,
    input,
    isLoading,
    messages,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
  } = useChat({
    id: postId,
    initialMessages: props.initialMessages,
    body: { postId, userDetails: profile.data },
    onFinish: () => {
      if (!props.initialMessages) {
        posthog.capture('post created', { postId });
        router.replace(`/dashboard/posts/${postId}`);
      }
      posthog.capture('post iteration created', { postId });
      // invalidating bcz the latest post iteration is changed
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
      queryClient.setQueryData<TAccount>(
        ['account'],
        (old) =>
          old && {
            ...old,
            credits: old.credits - 1,
          }
      );
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
    onError: () => {
      toast.error(
        'Could not generate post. Please contact support if issue persists.'
      );
    },
  });

  // current post text is the last message in the chat that is from the assistant
  const currentPostText = useMemo(
    () => getLastMatching(messages, (msg) => msg.role === 'assistant'),
    [messages]
  );

  // loop over all the current messages and find the last message that is from the assistant
  // and set the content of that message to the text
  const setCurrentPostText = useCallback(
    (text: string) => {
      setIsManuallyEditing(true);
      const lastMessage = getLastMatching(
        messages,
        (m) => m.role === 'assistant'
      );
      if (lastMessage) {
        setMessages(
          messages.map((m) =>
            m.id === lastMessage.id ? { ...m, content: text } : m
          )
        );
      }
    },
    [messages, setMessages]
  );

  // We do not want the useEffect below to run twice under any circumstances
  // so we use a ref to keep track of whether the initial message has been
  // completed or not.
  const hasInitialMessageCompleted = useRef(false);

  useEffect(() => {
    if (
      props.inpirationMessage &&
      !isLoading &&
      !hasInitialMessageCompleted.current &&
      !profile.isPending
    ) {
      hasInitialMessageCompleted.current = true;
      append({
        content: props.inpirationMessage,
        role: 'user',
      });
    }
  }, [props.inpirationMessage, isLoading, append, profile.isPending]);

  return (
    <main className='mx-auto flex h-full max-w-5xl flex-col px-2 py-6'>
      <div className='mb-2 flex grow flex-col gap-3 overflow-auto'>
        <PostHeader postId={postId} />
        <PostCanvas
          isLoading={isLoading && !currentPostText?.content}
          postId={postId}
          text={currentPostText?.content ?? ''}
          className='mt-6'
          onSave={setCurrentPostText}
          isManuallyEditing={isManuallyEditing}
        />
      </div>

      <EditSuggestions
        onSuggest={(suggestion) => {
          append({ role: 'user', content: suggestion });
          setIsManuallyEditing(false);
        }}
        disabled={
          isLoading || profile.data?.credits === 0 || !props.initialMessages
        }
      />

      <NewPostInput
        isLoading={isLoading}
        value={input}
        handleInputChange={handleInputChange}
        onSubmit={(e) => {
          if (profile.data?.credits === 0) {
            e.preventDefault();
            toast.error(t('app:noCreditsError'));
            return;
          }
          setInput('');
          handleSubmit(e);
          setIsManuallyEditing(false);
        }}
        placeholder={
          props.initialMessages
            ? t('app:editsPlaceholder')
            : t('app:writeHereToCreateAPost')
        }
      />
      <div className='mt-2 flex justify-between'>
        <PostTips />
      </div>
    </main>
  );
}
