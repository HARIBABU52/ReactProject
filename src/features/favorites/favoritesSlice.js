import { createSlice } from '@reduxjs/toolkit';

/**
 * Favorites Slice Reducer & State definition
 * Manages user's bookmarked characters with Redux State
 */

const loadInitialFavorites = () => {
  try {
    const saved = localStorage.getItem('redux_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialState = {
  items: loadInitialFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleFavorite: (state, action) => {
      const existsIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (existsIndex >= 0) {
        state.items.splice(existsIndex, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoritesSlice.actions;
export const selectFavorites = (state) => state.favorites.items;
export const selectIsFavorite = (id) => (state) => state.favorites.items.some((item) => item.id === id);

export default favoritesSlice.reducer;
