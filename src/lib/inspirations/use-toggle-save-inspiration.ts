import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createClient } from '@/services/supabase/client';

import TInspiration from './type';

export default function useToogleInspirationSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['toggleSaveInspiration'],
    mutationFn: async ({
      inspirationId,
      isAlreadySaved,
    }: {
      inspirationId: string;
      isAlreadySaved: boolean;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('inspirations')
        .update({
          isSaved: !isAlreadySaved,
        })
        .eq('id', inspirationId)
        .select('id,isSaved');

      if (error) {
        throw new Error("Couldn't save inspiration");
      }
    },
    onMutate: async ({ inspirationId, isAlreadySaved }) => {
      await queryClient.cancelQueries({ queryKey: ['inspirations'] });

      // get a snapshot of the current inspirations
      const previousGeneratedInspirations = queryClient.getQueryData<
        TInspiration[]
      >(['generatedInspirations']);

      const previousSavedInspirations = queryClient.getQueryData<
        TInspiration[]
      >(['savedInspirations']);

      // optimistic update
      queryClient.setQueryData<TInspiration[]>(
        ['generatedInspirations'],
        (old) =>
          old &&
          old.map((inspiration) => ({
            ...inspiration,
            isSaved:
              inspiration.id === inspirationId
                ? !isAlreadySaved
                : inspiration.isSaved,
          }))
      );

      // when saving the inspiration, we get the inspiration data from the previously generated inspirations
      const inspirationToSave = previousGeneratedInspirations?.find(
        (inspiration) => inspiration.id === inspirationId
      );

      queryClient.setQueryData<TInspiration[]>(
        ['savedInspirations'],
        (old) =>
          old &&
          (isAlreadySaved
            ? old.filter((item) => item.id !== inspirationId)
            : inspirationToSave
              ? [...old, inspirationToSave]
              : old)
      );

      return { previousGeneratedInspirations, previousSavedInspirations };
    },

    onError: (_, __, context) => {
      toast.error("Couldn't save inspiration. Please try again.");
      context &&
        queryClient.setQueryData(
          ['generatedInspirations'],
          context.previousGeneratedInspirations
        );
      context &&
        queryClient.setQueryData(
          ['savedInspirations'],
          context.previousSavedInspirations
        );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['generatedInspirations'] });
      queryClient.invalidateQueries({ queryKey: ['savedInspirations'] });
    },
  });
}
