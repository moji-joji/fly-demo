import { useRouter } from 'next/navigation';
import React from 'react';
import { PiArrowsClockwise, PiCircleNotch, PiTrash } from 'react-icons/pi';

import useDeletePost from '@/lib/post/use-delete-post';
import usePost from '@/lib/post/use-post';

import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Trans } from '../ui/trans';

type Props = {
  postId: string;
};

export default function PostHeader({ postId }: Props) {
  const post = usePost(postId);
  const deletePost = useDeletePost(postId);
  const router = useRouter();

  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-3xl font-semibold'>
        <Trans i18nKey="app:linkedInPostEditor" />
      </h2>
      {post.data && (
        <div className='flex gap-4'>
          <Button
            className='bg-tranparent gap-1.5 font-normal text-primary shadow-none hover:bg-transparent'
            variant='outline'
            onClick={() => router.push('/dashboard/create')}
          >
            <PiArrowsClockwise className='h-5 w-5' />
            <Trans i18nKey="app:startNewPost" />
          </Button>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='h-auto bg-red-500 px-0.5 py-1.5 text-white shadow-none hover:bg-red-400'
                  size='icon'
                  onClick={() => deletePost.mutate()}
                >
                  {deletePost.isPending ? (
                    <PiCircleNotch className='h-5 w-5 animate-spin' />
                  ) : (
                    <PiTrash className='h-5 w-5' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className='border bg-white text-black/70'>
                <Trans i18nKey="app:deletePost" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
