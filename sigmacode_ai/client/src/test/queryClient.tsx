import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
}

export function withQueryClient(client: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren<{}>) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}
