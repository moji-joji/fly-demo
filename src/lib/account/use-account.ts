import { useQuery } from '@tanstack/react-query';

import { createClient } from '@/services/supabase/client';


export default function useAccount() {
  return useQuery({
    queryKey: ['account'],
    queryFn: async () => {
      const supabase = createClient();

      const { data, error } = await supabase.from('profiles').select().single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .select(`credits,planType,userId`)
        .single();

      if (creditsError) {
        console.error('Error fetching credits:', creditsError);
        throw creditsError;
      }

      return {
        ...data,
        planType: credits.planType,
        credits: credits.credits,
      };
    },
  });
}

export type TAccount = NonNullable<ReturnType<typeof useAccount>['data']>;
