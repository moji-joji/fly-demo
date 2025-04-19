import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createClient } from '@/services/supabase/client';

import { Tables } from '@/types/database.types';

type TDeleteAvatar = {
  userId: string;
};

export default function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-avatar'],
    mutationFn: async () => {
      const supabase = createClient();

      // Delete the avatar image from Supabase
      const { error } = await supabase.from('profiles').update({
        avatar: null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Profile picture deleted successfully');
      queryClient.setQueryData<Tables<'profiles'>>(
        ['account'],
        (old) => old && { ...old, avatar: null }
      );
    },
    onError: () => {
      toast.error("Couldn't delete profile picture. Please try again");
    },
  });
}
