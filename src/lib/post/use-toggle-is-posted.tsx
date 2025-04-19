import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createClient } from '@/services/supabase/client';

import { Posts } from './use-posts';

export default function useToggleIsPosted(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['posts-toggle-isPosted', postId],
    mutationFn: async (isAlreadyPosted: boolean) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('posts')
        .update({ isPosted: !isAlreadyPosted })
        .eq('id', postId);

      if (error) throw error;
    },
    onMutate: (isAlreadyPosted: boolean) => {
      // Optimistically update the cache

      const previousData = queryClient.getQueryData<Posts>(['posts']);

      if (previousData) {
        queryClient.setQueryData<Posts>(
          ['posts'],
          previousData.map((post) =>
            post.id === postId ? { ...post, isPosted: !isAlreadyPosted } : post
          )
        );
      }

      return { previousData };
    },

    onError: (_, __, context) =>
      // Rollback to the previous data
      context &&
      queryClient.setQueryData<Posts>(['posts'], context.previousData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
