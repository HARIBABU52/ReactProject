/**
 * Custom Redux Middleware
 * Demonstrates the Redux Middleware pattern: (store) => (next) => (action) => { ... }
 * 
 * Functions performed by this middleware:
 * 1. Action Logger: Intercepts all actions, logs them with timestamps, and records metrics.
 * 2. LocalStorage Sync: Intercepts favorite mutations and syncs them to browser localStorage.
 * 3. Performance Monitor: Measures execution time of async action lifecycles.
 */

export const customReduxMiddleware = (storeAPI) => (next) => (action) => {
  const startTime = performance.now();
  const timestamp = new Date().toLocaleTimeString();

  // 1. Log to browser console with styling
  console.group(`%c Redux Action: ${action.type} @ ${timestamp}`, 'color: #00f0ff; font-weight: bold;');
  console.log('%c Prev State:', 'color: #9E9E9E; font-weight: bold;', storeAPI.getState());
  console.log('%c Action Payload:', 'color: #03A9F4; font-weight: bold;', action.payload);

  // 2. Call the next dispatch in the middleware chain to update state
  const result = next(action);

  const duration = (performance.now() - startTime).toFixed(2);
  const nextState = storeAPI.getState();
  console.log('%c Next State:', 'color: #4CAF50; font-weight: bold;', nextState);
  console.log(`%c Action Duration: ${duration}ms`, 'color: #FFC107; font-style: italic;');
  console.groupEnd();

  // 3. Prevent infinite recursion when logging actions to the logsSlice
  if (action.type !== 'logs/addLog' && action.type !== 'logs/clearLogs') {
    // Dynamically dispatch log action to store for UI Live Action Inspector
    setTimeout(() => {
      storeAPI.dispatch({
        type: 'logs/addLog',
        payload: {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: action.type,
          timestamp,
          duration: `${duration}ms`,
          payload: action.payload ? JSON.stringify(action.payload).slice(0, 100) : 'none',
        },
      });
    }, 0);
  }

  // 4. Persistence Middleware Logic: Save Favorites to localStorage on updates
  if (
    action.type === 'favorites/addFavorite' ||
    action.type === 'favorites/removeFavorite' ||
    action.type === 'favorites/clearFavorites'
  ) {
    const updatedFavorites = storeAPI.getState().favorites.items;
    try {
      localStorage.setItem('redux_favorites', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error('Failed to persist favorites to localStorage:', err);
    }
  }

  return result;
};
