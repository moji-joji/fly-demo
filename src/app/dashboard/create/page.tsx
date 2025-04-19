import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Post from '@/components/editor/post';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Create({ searchParams }: Props) {
  const postId = uuidv4();
  const message = searchParams['m'] as string | undefined;

  if (message) {
    return (
      <Post key={postId} postId={postId} inpirationMessage={message} />
    );
  }

  return <Post key={postId} postId={postId} />;
}
