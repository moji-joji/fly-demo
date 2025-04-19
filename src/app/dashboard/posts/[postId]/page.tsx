import { notFound } from 'next/navigation';
import React from 'react';

import Post from '@/components/editor/post';

import { createClient } from '@/services/supabase/server';

type Props = {
  params: { postId: string };
};

export default async function SinglePostEditor(props: Props) {
  const postId = props.params.postId;

  // get the latest post iteration from the db
  const supabase = createClient();

  const { data, error } = await supabase
    .from('postIterations')
    .select('*')
    .eq('postId', postId)
    .order('createdAt');

  if (error) return notFound();

  // for every post iteration, one message will be of the user and the other will be of the assistant,
  // loop through all the post iterations and [{ user-iteration-1 }, { assistant-iteration-1 }, { user-iteration-2 }, { assistant-iteration-2 } ...]

  const messages = [];

  for (const iteration of data) {
    messages.push({
      id: iteration.id + 'user',
      content: iteration.userMessage as string,
      role: 'user' as const,
    });

    messages.push({
      id: iteration.id + 'assistant',
      content: iteration.text,
      role: 'assistant' as const,
    });
  }

  return (
    <Post
      key={postId}
      postId={props.params.postId}
      initialMessages={messages}
    />
  );
}
