import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../features/favorites/favoritesSlice';
import { Bookmark, Heart, MapPin, Activity } from 'lucide-react';

export default function CharacterCard({ character }) {
  const dispatch = useDispatch();
  const isFav = useSelector(selectIsFavorite(character.id));

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(character));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'status-alive';
      case 'dead':
        return 'status-dead';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="card-container glow-effect">
      <div className="card-image-wrapper">
        <img
          src={character.image}
          alt={character.name}
          className="card-image"
          loading="lazy"
        />
        <div className={`status-badge ${getStatusColor(character.status)}`}>
          <span className="status-dot"></span>
          <span>{character.status}</span>
        </div>

        <button
          onClick={handleBookmark}
          className={`bookmark-floating-btn ${isFav ? 'active' : ''}`}
          title={isFav ? 'Remove from Vault' : 'Save to Vault'}
        >
          <Heart size={18} fill={isFav ? '#ff4757' : 'none'} color={isFav ? '#ff4757' : '#ffffff'} />
        </button>
      </div>

      <div className="card-content">
        <h3 className="character-name">{character.name}</h3>

        <div className="info-meta">
          <div className="meta-row">
            <span className="meta-label">Species & Gender:</span>
            <span className="meta-value">{character.species} • {character.gender}</span>
          </div>

          <div className="meta-row">
            <span className="meta-label">Origin:</span>
            <span className="meta-value flex-center gap-1">
              <MapPin size={13} className="accent-icon" />
              {character.origin.name}
            </span>
          </div>
        </div>

        <div className="card-actions">
          <Link to={`/character/${character.id}`} className="view-detail-btn">
            <span>Explore Stats & Episodes</span>
            <Activity size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
