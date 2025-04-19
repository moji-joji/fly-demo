import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { createClient } from '@/services/supabase/client';

export default function usePost(
  postId: string
  // initialData: { title: string }
) {
  const pathname = usePathname();
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const supabase = createClient();

      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      return post;
    },
    enabled: pathname.includes('posts'),
  });
}

export type Post = NonNullable<ReturnType<typeof usePost>['data']>;
