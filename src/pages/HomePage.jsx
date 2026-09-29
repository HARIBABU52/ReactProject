import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCharacters,
  selectAllCharacters,
  selectCharacterStatus,
  selectCharacterError,
  selectCharacterFilters,
  selectCharacterInfo,
} from '../features/characters/charactersSlice';
import FilterBar from '../components/FilterBar';
import CharacterCard from '../components/CharacterCard';
import Pagination from '../components/Pagination';
import { Loader2, AlertCircle, Compass, Zap } from 'lucide-react';

export default function HomePage() {
  const dispatch = useDispatch();
  const characters = useSelector(selectAllCharacters);
  const status = useSelector(selectCharacterStatus);
  const error = useSelector(selectCharacterError);
  const filters = useSelector(selectCharacterFilters);
  const info = useSelector(selectCharacterInfo);

  useEffect(() => {
    dispatch(fetchCharacters(filters));
  }, [dispatch, filters.name, filters.status, filters.gender, filters.page]);

  return (
    <div className="page-container fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tag">
            <Zap size={14} />
            <span>Page 1 of 2: Multiverse Explorer</span>
          </div>
          <h1 className="hero-title">
            OpenSource API Explorer <br />
            <span className="gradient-text">Powered by Redux Store</span>
          </h1>
          <p className="hero-description">
            Fetch multiverse characters from the public Rick & Morty REST API. All search queries, status filters, and pagination are handled via Redux Async Thunks, custom middleware logging, and immutable state.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="main-section max-w">
        <FilterBar />

        {/* Status Handling */}
        {status === 'loading' && (
          <div className="loading-container">
            <Loader2 size={48} className="spinner accent-color" />
            <p>Dispatching <code>fetchCharacters.pending</code> to Redux Store...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="error-card">
            <AlertCircle size={32} />
            <div>
              <h4>Error Fetching API Data</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {status === 'succeeded' && characters.length === 0 && (
          <div className="empty-state">
            <Compass size={48} className="muted-icon" />
            <h3>No Characters Found</h3>
            <p>No results match your active filter criteria. Try adjusting your search query.</p>
          </div>
        )}

        {status === 'succeeded' && characters.length > 0 && (
          <>
            <div className="results-meta">
              <span>Showing {characters.length} characters on page {filters.page} (Total: {info.count})</span>
            </div>

            <div className="character-grid">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>

            <Pagination />
          </>
        )}
      </section>
    </div>
  );
}
