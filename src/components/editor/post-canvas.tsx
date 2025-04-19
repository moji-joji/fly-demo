import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  PiClipboard,
  PiDesktop,
  PiDeviceMobile,
  PiDeviceTablet,
  PiMoon,
  PiSunDim,
} from 'react-icons/pi';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';

import { cn } from '@/lib/utils';

import { createClient } from '@/services/supabase/client';

import PostPreview, { PostSize } from './post-preview';
import { Button } from '../ui/button';
import { Trans } from '../ui/trans';
import { usePostHog } from 'posthog-js/react';

import { applyMarksToText, makeTextCompatibleWithTipTap } from './utils';

import { useEditor, EditorContent, Content, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic } from 'lucide-react';
import { ToggleGroup } from '@radix-ui/react-toggle-group';
import { ToggleGroupItem } from '../ui/toggle-group';

type Props = {
  postId: string;
  text: string;
  className?: string;
  onSave: (text: string) => void;
  isLoading: boolean;
  isManuallyEditing: boolean;
};

export default function PostCanvas({
  text,
  onSave,
  postId,
  isLoading,
  isManuallyEditing,
}: Props) {
  // post width will be based on the screen size
  const [postSize, setPostSize] = useState<PostSize>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const posthog = usePostHog();

  const save = useMutation({
    mutationKey: ['save-manual-edit', postId],
    mutationFn: async (text: string) => {
      const supabase = createClient();

      const { data: latestIteration, error: selectError } = await supabase
        .from('postIterations')
        .select('id')
        .eq('postId', postId)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      if (selectError) throw selectError;

      // Step 2: Update the selected iteration
      const { error: updateError } = await supabase
        .from('postIterations')
        .update({
          isManuallyEdited: true,
          text,
        })
        .eq('id', latestIteration.id);

      if (updateError) throw updateError;
    },
    onMutate: (newText) => {
      onSave(newText);
    },
    onError: () => toast.error('Failed to edit the post. Please try again.'),
  });

  return (
    <div className='flex grow flex-col overflow-auto'>
      {/* Toolbar */}
      <div className='flex items-center justify-between rounded-t-lg border-b bg-stone-50 px-3 py-1'>
        <div className='flex items-center gap-1.5'>
          <span className='text-sm'>
            <Trans i18nKey='app:device' />
          </span>
          <div className='flex w-fit gap-1 rounded-lg border border-neutral-300 bg-white p-1'>
            <PiDesktop
              onClick={() => setPostSize('desktop')}
              className={cn('h-6 w-6 cursor-pointer rounded-md p-0.5', {
                'bg-primary/15 text-primary': postSize === 'desktop',
                'hover:bg-neutral-300': postSize !== 'desktop',
              })}
            />
            <PiDeviceTablet
              onClick={() => setPostSize('tablet')}
              className={cn('h-6 w-6 cursor-pointer rounded-md p-0.5', {
                'bg-primary/15 text-primary': postSize === 'tablet',
                'hover:bg-neutral-200': postSize !== 'tablet',
              })}
            />
            <PiDeviceMobile
              onClick={() => setPostSize('mobile')}
              className={cn('h-6 w-6 cursor-pointer rounded-md p-0.5', {
                'bg-primary/15 text-primary': postSize === 'mobile',
                'hover:bg-neutral-200': postSize !== 'mobile',
              })}
            />
          </div>
        </div>

        <div>
          <Button
            onClick={() => {
              posthog.capture('post copied', { postId });
              navigator.clipboard.writeText(text);
              toast.success('Copied to clipboard');
            }}
            size='sm'
            className='h-7 rounded-full bg-primary/80 shadow-none'
          >
            <PiClipboard className='mr-1 h-3.5 w-3.5' />
            <Trans i18nKey='app:copy' />
          </Button>
        </div>

        <div className='flex items-center gap-1.5'>
          <span className='text-sm'>
            <Trans i18nKey='app:theme' />
          </span>
          <div className='flex w-fit gap-1 rounded-lg border border-neutral-300 bg-white p-1'>
            <PiSunDim
              onClick={() => setTheme('light')}
              className={cn('h-6 w-6 cursor-pointer rounded-md p-0.5', {
                'bg-primary/15 text-primary': theme === 'light',
                'hover:bg-neutral-300': theme !== 'light',
              })}
            />
            <PiMoon
              onClick={() => setTheme('dark')}
              className={cn('h-6 w-6 cursor-pointer rounded-md p-0.5', {
                'bg-primary/15 text-primary': theme === 'dark',
                'hover:bg-neutral-200': theme !== 'dark',
              })}
            />
          </div>
        </div>
      </div>
      <div className='flex grow divide-x overflow-auto rounded-b-lg'>
        <div className='h-full grow transition-all'>
          <PostEdit
            text={text}
            onSave={save.mutate}
            isManuallyEditing={isManuallyEditing}
          />
        </div>
        <div className='h-full w-fit shrink-0 overflow-auto transition-all'>
          <PostPreview
            isLoading={isLoading}
            text={text}
            theme={theme}
            postSize={postSize}
          />
        </div>
      </div>
    </div>
  );
}

function PostEdit({
  text,
  onSave,
  isManuallyEditing,
}: {
  text: string;
  onSave: (text: string) => void;
  isManuallyEditing: boolean;
}) {
  const debouncedSave = useDebounceCallback(onSave, 2000);

  const editor = useEditor({
    extensions: [StarterKit],
    content: makeTextCompatibleWithTipTap(text),
    onUpdate: ({ editor }) => {
      const state = editor.getJSON();
      debouncedSave(applyMarksToText(state));
    },
  });

  useEffect(() => {
    if (!editor || isManuallyEditing) return;
    editor.commands.setContent(makeTextCompatibleWithTipTap(text));
  }, [text, editor, isManuallyEditing]);

  return (
    <div className='relative flex h-full flex-col overflow-auto bg-white [&>*:last-child]:grow [&>*:last-child]:overflow-auto'>
      {editor && (
        <div className='flex gap-1 rounded-md border-b bg-transparent p-1.5'>
          <ToggleGroup
            type='multiple'
            className='flex gap-1.5'
            value={[
              editor.isActive('bold') ? 'bold' : '',
              editor.isActive('italic') ? 'italic' : '',
            ].filter(Boolean)}
          >
            <ToggleGroupItem
              value='bold'
              aria-label='Toggle bold'
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem
              value='italic'
              aria-label='Toggle italic'
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className='h-4 w-4' />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
