import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API Slice
 * Modern Redux Toolkit approach for data fetching & caching
 */
export const rickAndMortyApi = createApi({
  reducerPath: 'rickAndMortyApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://rickandmortyapi.com/api/' }),
  endpoints: (builder) => ({
    getCharacters: builder.query({
      query: ({ page = 1, name = '', status = '', gender = '' }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (name) params.append('name', name);
        if (status) params.append('status', status);
        if (gender) params.append('gender', gender);
        return `character/?${params.toString()}`;
      },
    }),
    getCharacterById: builder.query({
      query: (id) => `character/${id}`,
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterByIdQuery } = rickAndMortyApi;
