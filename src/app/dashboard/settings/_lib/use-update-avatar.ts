import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createClient } from '@/services/supabase/client';

import { TAccount } from '../../../../lib/account/use-account';

type TUpdateAvatar = {
  userId: string;
  avatar: File | null;
};

export default function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-avatar'],
    mutationFn: async (profile: TUpdateAvatar) => {
      if (!profile.avatar) {
        throw new Error('No avatar image provided');
      }
      const supabase = createClient();

      // the avatar image to Supabase
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${profile.userId}/${Date.now()}`, profile.avatar);

      if (error) throw error;

      const avatarUrl = supabase.storage.from('avatars').getPublicUrl(data.path)
        .data.publicUrl;

      // Update the profile with the new avatar URL
      const { error: uploadError } = await supabase.from('profiles').update({
        avatar: avatarUrl,
      });

      if (uploadError) throw error;

      return avatarUrl;
    },
    onSuccess: (avatarUrl) => {
      toast.success('Profile picture updated successfully');
      queryClient.setQueryData<TAccount>(
        ['account'],
        (old) => old && { ...old, avatar: avatarUrl }
      );
    },
    onError: () => {
      toast.error("Couldn't update profile picture. Please try again");
    },
  });
}
