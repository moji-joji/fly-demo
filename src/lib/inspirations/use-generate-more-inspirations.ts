import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import generateMoreInspirations from './server/generate-more';
import Inspiration from './type';
import { TAccount } from '../account/use-account';

export default function useGenerateMoreInspirations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['generateMoreInspirations'],
    mutationFn: generateMoreInspirations,
    onSuccess: (newInspirations) => {
      queryClient.setQueryData<Inspiration[]>(
        ['generatedInspirations'],
        newInspirations
      );

      queryClient.setQueryData<TAccount>(
        ['account'],
        (old) =>
          old && {
            ...old,
            credits: old.credits - 1,
          }
      );
    },
    onError: () => {
      toast.error("Couldn't generate more inspirations. Please try again");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['generatedInspirations'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
  });
}
