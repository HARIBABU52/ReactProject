import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTanStackCharacterDetail } from '../services/tanstackApi';
import { toggleFavorite, selectIsFavorite } from '../features/favorites/favoritesSlice';
import {
  ArrowLeft,
  Heart,
  Loader2,
  Calendar,
  Tv,
  Film,
  Globe,
  Database,
  Flame,
  AlertCircle,
} from 'lucide-react';

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // TanStack Query custom hook for server-state character detail fetching & caching
  const { data, isLoading, isError, error } = useTanStackCharacterDetail(id);
  const isFav = useSelector(selectIsFavorite(Number(id)));

  const character = data?.character;
  const episodes = data?.episodes || [];

  const handleToggleFav = () => {
    if (character) {
      dispatch(toggleFavorite(character));
    }
  };

  return (
    <div className="page-container max-w fade-in">
      <div className="top-navigation">
        <Link to="/" className="back-btn">
          <ArrowLeft size={18} />
          <span>Back to Explorer</span>
        </Link>
        <span className="page-badge">Page 2 of 2: Character Details (TanStack Cached)</span>
      </div>

      {isLoading && (
        <div className="loading-container">
          <Loader2 size={48} className="spinner accent-color" />
          <p>Fetching full character metadata and episode history via TanStack Query...</p>
        </div>
      )}

      {isError && (
        <div className="error-card">
          <AlertCircle size={32} />
          <div>
            <h4>Error Loading Character Details</h4>
            <p>{error?.message || 'Failed to fetch details'}</p>
          </div>
        </div>
      )}

      {!isLoading && !isError && character && (
        <div className="detail-layout">
          {/* Main Hero Card */}
          <div className="detail-card">
            <div className="detail-header-grid">
              <div className="avatar-section">
                <img
                  src={character.image}
                  alt={character.name}
                  className="detail-avatar"
                />
                <button
                  onClick={handleToggleFav}
                  className={`vault-toggle-btn ${isFav ? 'active' : ''}`}
                >
                  <Heart size={18} fill={isFav ? '#ff4757' : 'none'} color={isFav ? '#ff4757' : '#ffffff'} />
                  <span>{isFav ? 'Saved in Redux Vault' : 'Save to Redux Vault'}</span>
                </button>
              </div>

              <div className="detail-info-section">
                <div className="title-row">
                  <h2>{character.name}</h2>
                  <span className={`status-pill status-${character.status.toLowerCase()}`}>
                    {character.status}
                  </span>
                </div>

                <p className="species-subtitle">
                  {character.species} {character.type ? `(${character.type})` : ''} • {character.gender}
                </p>

                <div className="stats-grid">
                  <div className="stat-box">
                    <Globe size={18} className="accent-icon" />
                    <div>
                      <span className="stat-label">Origin Location</span>
                      <span className="stat-value">{character.origin.name}</span>
                    </div>
                  </div>

                  <div className="stat-box">
                    <Globe size={18} className="accent-icon" />
                    <div>
                      <span className="stat-label">Current Location</span>
                      <span className="stat-value">{character.location.name}</span>
                    </div>
                  </div>

                  <div className="stat-box">
                    <Film size={18} className="accent-icon" />
                    <div>
                      <span className="stat-label">Total Episodes</span>
                      <span className="stat-value">{character.episode.length} Featured Episodes</span>
                    </div>
                  </div>

                  <div className="stat-box">
                    <Calendar size={18} className="accent-icon" />
                    <div>
                      <span className="stat-label">Database Record</span>
                      <span className="stat-value">{new Date(character.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode Appearances Section */}
            {episodes.length > 0 && (
              <div className="episodes-section">
                <div className="section-title">
                  <Tv size={20} className="accent-icon" />
                  <h3>Debut & Featured Episodes</h3>
                </div>

                <div className="episode-cards-grid">
                  {episodes.map((ep) => (
                    <div key={ep.id} className="episode-card">
                      <span className="episode-code">{ep.episode}</span>
                      <h4 className="episode-name">{ep.name}</h4>
                      <span className="episode-date">Air Date: {ep.air_date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TanStack + Redux State Inspector Box */}
            <div className="redux-explain-box">
              <div className="explain-header">
                <Flame size={18} className="accent-icon" />
                <h4>TanStack Query Cache Snapshot for `['characterDetail', '{character.id}']`</h4>
              </div>
              <pre className="json-code">
                {JSON.stringify(
                  {
                    queryKey: ['characterDetail', String(character.id)],
                    cacheStatus: 'Fresh (Cached in Memory)',
                    id: character.id,
                    name: character.name,
                    status: character.status,
                    species: character.species,
                    isSavedInReduxVault: isFav,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
