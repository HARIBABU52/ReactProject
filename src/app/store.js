import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../features/characters/charactersSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import logsReducer from '../features/logs/logsSlice';
import { customReduxMiddleware } from './middleware/customMiddleware';

/**
 * Main Redux Store Setup
 * Combines Reducers, Configures Root State, and Attaches Custom Middleware
 */
export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    favorites: favoritesReducer,
    logs: logsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(customReduxMiddleware),
});

// Attach store to window object for instant browser console debugging
if (typeof window !== 'undefined') {
  window.store = store;
  console.log(
    '%c 🚀 Redux Store attached to window.store! Try typing store.getState() in this console.',
    'color: #00f0ff; font-weight: bold; font-size: 13px;'
  );
}

export default store;
