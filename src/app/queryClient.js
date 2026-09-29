import { QueryClient } from '@tanstack/react-query';

/**
 * Central TanStack Query Client Configuration
 * Features:
 * - staleTime: 5 Minutes (Data considered fresh for 5 mins)
 * - gcTime: 10 Minutes (Garbage collection cache retention)
 * - refetchOnWindowFocus: Automatically updates when tab gains focus
 * - retry: 2 retries on network failure
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 mins
      gcTime: 1000 * 60 * 10, // 10 mins
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

export default queryClient;
