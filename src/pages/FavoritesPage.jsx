import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectFavorites,
  clearFavorites,
  removeFavorite,
} from '../features/favorites/favoritesSlice';
import CharacterCard from '../components/CharacterCard';
import { Bookmark, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  return (
    <div className="page-container max-w fade-in">
      <div className="favorites-header">
        <div>
          <div className="hero-tag">
            <Bookmark size={14} />
            <span>Redux Persisted State Vault</span>
          </div>
          <h1 className="page-title">Saved Character Vault</h1>
          <p className="page-subtitle">
            Items saved here are managed in the <code>favorites</code> Redux Slice and automatically synced to browser <code>localStorage</code> via Custom Redux Middleware.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={() => dispatch(clearFavorites())}
            className="clear-all-btn"
          >
            <Trash2 size={16} />
            <span>Clear Vault</span>
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-vault-card">
          <Bookmark size={56} className="muted-icon" />
          <h3>Your Vault is Empty</h3>
          <p>You haven't bookmarked any characters yet. Explore the multiverse and click the heart icon to save characters to Redux store!</p>
          <Link to="/" className="explore-link-btn">
            <Sparkles size={16} />
            <span>Go to Multiverse Explorer</span>
          </Link>
        </div>
      ) : (
        <div className="character-grid">
          {favorites.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}
