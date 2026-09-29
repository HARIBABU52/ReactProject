import { useQuery } from '@tanstack/react-query';

/**
 * Fetcher function for character list
 */
const fetchCharacterList = async ({ page, name, status, gender }) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (name) params.append('name', name);
  if (status) params.append('status', status);
  if (gender) params.append('gender', gender);

  const response = await fetch(`https://rickandmortyapi.com/api/character/?${params.toString()}`);
  if (!response.ok) {
    if (response.status === 404) {
      return { results: [], info: { pages: 0, count: 0 } };
    }
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Custom Hook: TanStack Query for Characters List
 */
export const useTanStackCharacters = (filters) => {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: () => fetchCharacterList(filters),
    keepPreviousData: true,
  });
};

/**
 * Fetcher function for single character detail
 */
const fetchCharacterDetail = async (id) => {
  const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!response.ok) throw new Error('Failed to load character');
  const character = await response.json();

  let episodes = [];
  if (character.episode && character.episode.length > 0) {
    const promises = character.episode.slice(0, 5).map((url) =>
      fetch(url).then((res) => (res.ok ? res.json() : null))
    );
    episodes = (await Promise.all(promises)).filter(Boolean);
  }

  return { character, episodes };
};

/**
 * Custom Hook: TanStack Query for Character Details
 */
export const useTanStackCharacterDetail = (id) => {
  return useQuery({
    queryKey: ['characterDetail', id],
    queryFn: () => fetchCharacterDetail(id),
    enabled: Boolean(id),
  });
};
