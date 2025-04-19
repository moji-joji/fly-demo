import { useQuery } from '@tanstack/react-query';

import { createClient } from '@/services/supabase/client';

import TInspiration from './type';

export default function useGeneratedInspirations() {
  return useQuery<TInspiration[]>({
    queryKey: ['generatedInspirations'],
    queryFn: async () => {
      // get the latest 4 inspirations from db
      const supabase = createClient();
      const { data, error } = await supabase
        .from('inspirations')
        .select('id,text,category,isSaved')
        .order('createdAt', { ascending: false })
        .order('id', { ascending: false })
        .limit(3);

      if (error) throw error;

      return data;
    },
  });
}
