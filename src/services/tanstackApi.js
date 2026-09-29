import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Fetcher: Character List
 */
const fetchCharacterList = async ({ page = 1, name = '', status = '', gender = '' }) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (name) params.append('name', name);
  if (status) params.append('status', status);
  if (gender) params.append('gender', gender);

  const response = await fetch(`${API_BASE_URL}/character/?${params.toString()}`);
  if (!response.ok) {
    if (response.status === 404) {
      return { results: [], info: { pages: 0, count: 0 } };
    }
    throw new Error(`API Request Failed with Status ${response.status}`);
  }
  return response.json();
};

/**
 * TanStack Query Hook: Characters List
 */
export const useTanStackCharacters = (filters) => {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: () => fetchCharacterList(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetcher: Single Character Detail + Episodes
 */
const fetchCharacterDetail = async (id) => {
  const response = await fetch(`${API_BASE_URL}/character/${id}`);
  if (!response.ok) throw new Error(`Character #${id} not found`);
  const character = await response.json();

  let episodes = [];
  if (character.episode && character.episode.length > 0) {
    const episodePromises = character.episode.slice(0, 5).map((url) =>
      fetch(url).then((res) => (res.ok ? res.json() : null))
    );
    episodes = (await Promise.all(episodePromises)).filter(Boolean);
  }

  return { character, episodes };
};

/**
 * TanStack Query Hook: Character Detail
 */
export const useTanStackCharacterDetail = (id) => {
  return useQuery({
    queryKey: ['characterDetail', String(id)],
    queryFn: () => fetchCharacterDetail(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * -------------------------------------------------------------
 * TanStack Query Key Methods: getQueryData & setQueryData
 * -------------------------------------------------------------
 */

/**
 * Helper: getQueryData by Query Key
 * Retrieves cached data directly from TanStack Query memory
 */
export const getCachedDataByKey = (queryClient, queryKey) => {
  return queryClient.getQueryData(queryKey);
};

/**
 * Helper: setQueryData by Query Key
 * Manually updates/overwrites TanStack Query cached state by Query Key
 */
export const setCachedDataByKey = (queryClient, queryKey, updaterFnOrValue) => {
  return queryClient.setQueryData(queryKey, updaterFnOrValue);
};

/**
 * Helper: invalidateQueries by Query Key
 * Forces TanStack Query to refetch stale queries by Query Key
 */
export const invalidateQueriesByKey = (queryClient, queryKey) => {
  return queryClient.invalidateQueries({ queryKey });
};
