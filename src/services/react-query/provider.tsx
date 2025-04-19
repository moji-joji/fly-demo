'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { monitorError } from '@/lib/monitor-error';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      monitorError({
        contextName: 'query',
        contextData: { queryHash: query.queryHash },
        error,
        fingerprint: [query.queryHash.replaceAll(/[0-9]/g, '0')],
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      monitorError({
        error,
        fingerprint: mutation.options.mutationKey as string[],
        contextName: 'mutation',
        contextData: {
          mutationId: mutation.mutationId,
          variables: mutation.state.variables,
        },
      });
    },
  }),
});

export default function RQProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
