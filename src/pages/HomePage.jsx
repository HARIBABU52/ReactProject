import React from 'react';
import { useSelector } from 'react-redux';
import { selectCharacterFilters } from '../features/characters/charactersSlice';
import { useTanStackCharacters } from '../services/tanstackApi';
import FilterBar from '../components/FilterBar';
import CharacterCard from '../components/CharacterCard';
import Pagination from '../components/Pagination';
import { Loader2, AlertCircle, Compass, Zap, Flame, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const filters = useSelector(selectCharacterFilters);

  // TanStack Query custom hook for server-state fetching & caching
  const { data, isLoading, isError, error, isFetching, refetch } = useTanStackCharacters(filters);

  const characters = data?.results || [];
  const info = data?.info || { pages: 1, count: 0 };

  return (
    <div className="page-container fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tag">
            <Flame size={14} className="accent-icon" />
            <span>Page 1 of 2: TanStack Query + Redux Explorer</span>
          </div>
          <h1 className="hero-title">
            OpenSource API Explorer <br />
            <span className="gradient-text">Powered by TanStack Query & Redux</span>
          </h1>
          <p className="hero-description">
            Server state, automatic caching (5-min <code>staleTime</code>), and background refetching are managed by <strong>TanStack Query</strong>. UI client state, filters, and bookmarks are managed by <strong>Redux Store</strong>.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="main-section max-w">
        <FilterBar />

        {/* TanStack Query Live Caching Badge */}
        <div className="tanstack-cache-bar" style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          background: 'rgba(0, 240, 255, 0.05)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          padding: '0.65rem 1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff' }}>
            <Flame size={16} />
            <span><strong>TanStack Query Server Cache:</strong> {isFetching ? 'Syncing with OpenSource API...' : 'Fresh Data (Cached in Memory)'}</span>
          </div>
          <button
            onClick={() => refetch()}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            <RefreshCw size={14} className={isFetching ? 'spinner' : ''} />
            <span>Force Refetch</span>
          </button>
        </div>

        {/* Status Handling */}
        {isLoading && (
          <div className="loading-container">
            <Loader2 size={48} className="spinner accent-color" />
            <p>Fetching & Caching Multiverse Characters via TanStack Query...</p>
          </div>
        )}

        {isError && (
          <div className="error-card">
            <AlertCircle size={32} />
            <div>
              <h4>Error Loading API Data</h4>
              <p>{error?.message || 'Failed to fetch characters from server'}</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && characters.length === 0 && (
          <div className="empty-state">
            <Compass size={48} className="muted-icon" />
            <h3>No Characters Found</h3>
            <p>No results match your active filter criteria. Try adjusting your search query.</p>
          </div>
        )}

        {!isLoading && !isError && characters.length > 0 && (
          <>
            <div className="results-meta">
              <span>Showing {characters.length} characters on page {filters.page} (Total: {info.count})</span>
            </div>

            <div className="character-grid">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>

            <Pagination totalPages={info.pages} count={info.count} />
          </>
        )}
      </section>
    </div>
  );
}
