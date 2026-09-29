import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFavorites } from '../features/favorites/favoritesSlice';
import { Sparkles, Bookmark, Terminal, Compass, Layers } from 'lucide-react';

export default function Navbar({ toggleInspector, showInspector }) {
  const location = useLocation();
  const favorites = useSelector(selectFavorites);

  return (
    <header className="navbar-container">
      <div className="navbar-inner max-w">
        <Link to="/" className="brand-logo">
          <div className="logo-icon">
            <Compass className="icon-spin" size={24} />
          </div>
          <div className="logo-text">
            <span className="logo-title">PORTAL<span className="accent">DEX</span></span>
            <span className="logo-subtitle">OpenSource API + Redux Store</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Sparkles size={18} />
            <span>Explorer</span>
          </Link>

          <Link
            to="/favorites"
            className={`nav-btn ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            <Bookmark size={18} />
            <span>Vault</span>
            {favorites.length > 0 && (
              <span className="badge-count">{favorites.length}</span>
            )}
          </Link>

          <button
            onClick={toggleInspector}
            className={`inspector-toggle-btn ${showInspector ? 'open' : ''}`}
            title="Toggle Redux State & Middleware Live Inspector"
          >
            <Layers size={18} />
            <span>Redux DevTools</span>
            <span className="pulse-dot"></span>
          </button>
        </nav>
      </div>
    </header>
  );
}
