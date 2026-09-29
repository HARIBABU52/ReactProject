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

// Attach queryClient to window object for instant browser console debugging
if (typeof window !== 'undefined') {
  window.queryClient = queryClient;
  console.log(
    '%c 🔥 TanStack QueryClient attached to window.queryClient! Try typing queryClient.getQueryCache() in console.',
    'color: #ff007f; font-weight: bold; font-size: 13px;'
  );
}

export default queryClient;
