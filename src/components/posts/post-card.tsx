import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import React from 'react';
import { PiCircleNotch, PiTrash } from 'react-icons/pi';

import useDeletePost from '@/lib/post/use-delete-post';
import { Posts } from '@/lib/post/use-posts';
import useToggleIsPosted from '@/lib/post/use-toggle-is-posted';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Trans } from '../ui/trans';

const MAX_LENGTH = 200;

type Props = {
  post: Posts[number];
};

export default function PostCard({ post }: Props) {
  const deletePost = useDeletePost(post.id);
  const togglePosted = useToggleIsPosted(post.id);
  const posthog = usePostHog();
  return (
    <div
      className={cn('flex flex-col rounded-lg p-3 shadow', {
        'border border-primary/50 bg-white': !post.isPosted,
        'border border-[#A6A8AB]/50 bg-[#E4E4E4]': post.isPosted,
      })}
    >
      <div className='flex justify-between'>
        {/* posted or not */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-0.5',
            {
              '': !post.isPosted,
              'border-[#565656] bg-[#565656]': post.isPosted,
            }
          )}
        >
          <Checkbox
            onClick={() => {
              if (post.isPosted) {
                posthog.capture('post_unposted', { post_id: post.id });
              } else {
                posthog.capture('post_posted', { post_id: post.id });
              }

              return togglePosted.mutate(post.isPosted);
            }}
            className='rounded-md data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-[#565656]'
            checked={post.isPosted}
            id={`post-${post.id}`}
          />
          <Label
            className={cn('cursor-pointer text-sm', {
              'text-black-1': !post.isPosted,
              'text-white': post.isPosted,
            })}
            htmlFor={`post-${post.id}`}
          >
            <Trans i18nKey='app:posted' />
          </Label>
        </div>
        {/* saved or not */}
        <div>
          <Button
            onClick={() => deletePost.mutate()}
            style={{ boxShadow: '0px 2px 4px 0px rgba(42, 89, 255, 0.20)' }}
            className='h-6 w-6 rounded-full bg-white hover:bg-white/90'
            size='icon'
          >
            {deletePost.isPending ? (
              <PiCircleNotch className='animate-spin text-blue-4' />
            ) : (
              <PiTrash className='text-blue-4' />
            )}
          </Button>
        </div>
      </div>
      <Link href={`/dashboard/posts/${post.id}`}>
        <h3 className='mt-2 text-sm'>
          {post.text.length > MAX_LENGTH
            ? `${post.text.slice(0, MAX_LENGTH)}...`
            : post.text}
        </h3>
      </Link>
    </div>
  );
}
