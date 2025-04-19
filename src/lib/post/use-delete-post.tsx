import { createClient } from '@/services/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useDeletePost(postId: string) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  return useMutation({
    mutationKey: ['posts-delete', postId],
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.from('posts').delete().eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      if (pathname !== '/dashboard/posts') router.replace('/dashboard/create');
    },

    onError: (_, __, context) => {
      toast.error("Couldn't delete post. Please try again");
    },
  });
}
