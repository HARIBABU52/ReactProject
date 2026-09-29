import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async Thunk to fetch character list from Open Source Rick & Morty API
 */
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ page = 1, name = '', status = '', gender = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (name) params.append('name', name);
      if (status) params.append('status', status);
      if (gender) params.append('gender', gender);

      const response = await fetch(`https://rickandmortyapi.com/api/character/?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { results: [], info: { pages: 0, count: 0, next: null, prev: null } };
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch characters');
    }
  }
);

/**
 * Async Thunk to fetch detailed character metadata by ID
 */
export const fetchCharacterById = createAsyncThunk(
  'characters/fetchCharacterById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to load character #${id}`);
      }
      const data = await response.json();
      
      // Fetch details for first 3 episodes if available
      let episodeDetails = [];
      if (data.episode && data.episode.length > 0) {
        const episodePromises = data.episode.slice(0, 5).map((epUrl) =>
          fetch(epUrl).then((res) => (res.ok ? res.json() : null))
        );
        const epResults = await Promise.all(episodePromises);
        episodeDetails = epResults.filter(Boolean);
      }

      return { character: data, episodes: episodeDetails };
    } catch (error) {
      return rejectWithValue(error.message || 'Error loading character details');
    }
  }
);

/**
 * Initial Redux State structure for Characters slice
 */
const initialState = {
  list: [],
  info: { pages: 1, count: 0, next: null, prev: null },
  selectedCharacter: null,
  selectedEpisodes: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  detailStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  detailError: null,
  filters: {
    name: '',
    status: '',
    gender: '',
    page: 1,
  },
};

/**
 * Characters Reducer Slice
 */
const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilterName: (state, action) => {
      state.filters.name = action.payload;
      state.filters.page = 1; // Reset to page 1 on filter change
    },
    setFilterStatus: (state, action) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setFilterGender: (state, action) => {
      state.filters.gender = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { name: '', status: '', gender: '', page: 1 };
    },
    clearSelectedCharacter: (state) => {
      state.selectedCharacter = null;
      state.selectedEpisodes = [];
      state.detailStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list cases
      .addCase(fetchCharacters.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.results || [];
        state.info = action.payload.info || { pages: 1, count: 0, next: null, prev: null };
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong while fetching character list';
      })
      // Fetch single detail cases
      .addCase(fetchCharacterById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedCharacter = action.payload.character;
        state.selectedEpisodes = action.payload.episodes;
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload || 'Failed to fetch detail';
      });
  },
});

export const {
  setFilterName,
  setFilterStatus,
  setFilterGender,
  setPage,
  resetFilters,
  clearSelectedCharacter,
} = charactersSlice.actions;

export const selectAllCharacters = (state) => state.characters.list;
export const selectCharacterInfo = (state) => state.characters.info;
export const selectCharacterStatus = (state) => state.characters.status;
export const selectCharacterError = (state) => state.characters.error;
export const selectCharacterFilters = (state) => state.characters.filters;

export const selectSelectedCharacter = (state) => state.characters.selectedCharacter;
export const selectSelectedEpisodes = (state) => state.characters.selectedEpisodes;
export const selectDetailStatus = (state) => state.characters.detailStatus;

export default charactersSlice.reducer;
