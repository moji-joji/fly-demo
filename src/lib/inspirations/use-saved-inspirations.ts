import { useQuery } from '@tanstack/react-query';

import { createClient } from '@/services/supabase/client';

import TInspiration from './type';

export default function useSavedInspirations() {
  return useQuery<TInspiration[]>({
    queryKey: ['savedInspirations'],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('inspirations')
        .select('id,text,category,isSaved,createdAt')
        .eq('isSaved', true)
        .order('createdAt', { ascending: false })
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
