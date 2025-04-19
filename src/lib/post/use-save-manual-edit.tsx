import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createClient } from '@/services/supabase/client';

export default function useSaveManualEdit(postId: string) {
  return useMutation({
    mutationKey: ['save-manual-edit', postId],
    mutationFn: async (text: string) => {
      // get the message id for the lastest assistant message
      const supabase = createClient();

      // create a new entry into post iterations table
      const { error } = await supabase.from('postIterations').insert({
        postId,
        text,
        isManuallyEdited: true,
      });

      if (error) throw error;
    },
    onError: () => {
      toast.error('Failed to edit the post. Please try again.');
    },
  });
}
