'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import useSavedPosts, { Posts as TPosts } from '@/lib/post/use-posts';

import PostCard from '@/components/posts/post-card';
import { Trans } from '@/components/ui/trans';
import LoadingAnimation from '@/components/loading-animation';
import ErrorScreen from '@/components/error-screen';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function Posts() {
  const posts = useSavedPosts();
  const { t } = useTranslation('app');

  if (posts.isPending) return <LoadingAnimation />;

  if (posts.isError) return <ErrorScreen />;

  return (
    <div className='px-3 py-6 md:px-6 xl:px-11'>
      <h1 className='text-3xl font-bold'>
        <Trans i18nKey='app:savedPosts' />
      </h1>
      <div className='py-4'>
        <PostGrid
          emptyText={t('app:savedPostsDescription')}
          posts={posts.data.filter((post) => !post.isPosted)}
        />
      </div>
      <div>
        <h2 className='mb-4 text-2xl font-semibold'>
          <Trans i18nKey='app:posted' />
        </h2>
        <PostGrid
          emptyText={t('app:postedDescription')}
          posts={posts.data.filter((post) => post.isPosted)}
        />
      </div>
    </div>
  );
}

function PostGrid({ posts, emptyText }: { posts: TPosts; emptyText: string }) {
  const [limit, setLimit] = React.useState(8);

  if (posts.length === 0) {
    return (
      <div className='flex h-20 items-center justify-center opacity-60'>
        {emptyText}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {posts.slice(0, limit).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {limit < posts.length && (
        <Button size='sm' variant='link' onClick={() => setLimit(posts.length)}>
          <ChevronDown className='relative top-[1px] mr-0.5 h-3.5 w-3.5' />
          View All
        </Button>
      )}
    </div>
  );
}
