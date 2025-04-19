import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createClient } from '@/services/supabase/client';

import { Tables } from '@/types/database.types';

type TUpdateProfileArgs = {
  name: string;
};

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: async (profile: TUpdateProfileArgs) => {
      const supabase = createClient();

      const { error } = await supabase.from('profiles').update(profile);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      toast.success('Profile updated successfully');
      queryClient.setQueryData<Tables<'profiles'>>(
        ['account'],
        (old) => old && { ...old, ...variables }
      );
    },
    onError: () => {
      toast.error("Couldn't update profile. Please try again");
    },
  });
}
