import { t } from 'i18next';
import { usePostHog } from 'posthog-js/react';
import React, { useRef } from 'react';
import {
  PiArrowsInLineVertical,
  PiBook,
  PiCaretLeft,
  PiCaretRight,
  PiListDashes,
  PiNote,
  PiSmiley,
  PiUserSound,
} from 'react-icons/pi';
import { toast } from 'sonner';

import useAccount from '@/lib/account/use-account';

import { Button } from '../ui/button';
import { Trans } from '../ui/trans';

type Props = {
  onSuggest: (suggestion: string) => void;
  disabled: boolean;
};

const suggestions = [
  {
    text: 'suggestionAddEmojis',
    icon: PiSmiley,
    prompt: 'Add emojis to make the post more engaging and expressive.',
  },
  {
    text: 'suggestionConciseText',
    icon: PiNote,
    prompt: 'Make the text more concise to improve readability.',
  },
  {
    text: 'suggestionImproveSpacing',
    icon: PiArrowsInLineVertical,
    prompt:
      'Improve spacing between the lines and paragraphs to make the post more readable.',
  },
  {
    text: 'suggestionInsertPersonalAnecdote',
    icon: PiBook,
    prompt: 'Insert a personal anecdote in the post to make it more engaging.',
  },
  {
    text: 'suggestionUseBetterHook',
    icon: PiUserSound,
    prompt: "Use a better hook to grab the reader's attention.",
  },
  {
    text: 'suggestionMakeList',
    icon: PiListDashes,
    prompt:
      'Make bullet points or numbered lists of the key points to make the post more scannable.',
  },
];

export default function EditSuggestions({ onSuggest, disabled }: Props) {
  const account = useAccount();
  const scrollRef = useRef<HTMLDivElement>(null);
  const posthog = usePostHog();

  const handleScroll = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className='mb-2 flex items-center gap-2 '>
      <Button
        size='icon'
        variant='outline'
        className='h-7 w-7 shrink-0 rounded-full'
        onClick={() => handleScroll(-150)}
      >
        <PiCaretLeft className='h-4 w-4' />
      </Button>
      <div
        ref={scrollRef}
        className='hide-scrollbars flex grow items-center gap-2 overflow-auto scroll-smooth'
      >
        {suggestions.map((suggestion) => (
          <Button
            disabled={disabled}
            className='flex h-auto items-center space-x-1 rounded-md border border-primary/20 bg-transparent px-2.5 py-1 font-normal text-primary shadow-none hover:border-primary hover:bg-primary/5'
            key={suggestion.text}
            onClick={() => {
              posthog.capture('suggestion_clicked', {
                suggestion: suggestion.text,
              });
              if (account.data?.credits === 0)
                return toast.error(t('app:noCreditsError'));
              onSuggest(suggestion.prompt);
            }}
          >
            <suggestion.icon className='h-4 w-4 shrink-0' />
            <span className='text-sm'>
              <Trans i18nKey={`app:${suggestion.text}`} />
            </span>
          </Button>
        ))}
      </div>
      <Button
        size='icon'
        variant='outline'
        className='h-7 w-7 shrink-0 rounded-full'
        onClick={() => handleScroll(150)}
      >
        <PiCaretRight className='h-4 w-4' />
      </Button>
    </div>
  );
}
