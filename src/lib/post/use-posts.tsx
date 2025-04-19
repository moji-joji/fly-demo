import { useQuery } from '@tanstack/react-query';

import { createClient } from '@/services/supabase/client';

export default function useSavedPosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const supabase = createClient();

      const { data: posts, error } = await supabase.rpc(
        'get_posts_with_latest_content'
      );

      if (error) throw error;

      return posts;
    },
  });
}

export type Posts = NonNullable<ReturnType<typeof useSavedPosts>['data']>;
