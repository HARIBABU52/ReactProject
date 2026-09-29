import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../features/characters/charactersSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import logsReducer from '../features/logs/logsSlice';
import { rickAndMortyApi } from '../features/api/apiSlice';
import { customReduxMiddleware } from './middleware/customMiddleware';

/**
 * Main Redux Store Setup (Enhanced with RTK Query & Custom Middleware)
 */
export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    favorites: favoritesReducer,
    logs: logsReducer,
    [rickAndMortyApi.reducerPath]: rickAndMortyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(rickAndMortyApi.middleware)
      .concat(customReduxMiddleware),
});

// Attach store to window object for instant browser console debugging
if (typeof window !== 'undefined') {
  window.store = store;
}

export default store;
