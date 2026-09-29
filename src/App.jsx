import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ReduxStateInspector from './components/ReduxStateInspector';

export default function App() {
  const [showInspector, setShowInspector] = useState(true);

  return (
    <div className="app-shell">
      <Navbar
        toggleInspector={() => setShowInspector(!showInspector)}
        showInspector={showInspector}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<DetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>

      <ReduxStateInspector
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
      />

      <footer className="app-footer">
        <div className="max-w footer-inner">
          <p>© 2026 PortalDex • Built with OpenSource Rick & Morty REST API & Redux Toolkit Architecture</p>
          <div className="footer-links">
            <span className="footer-chip">Redux Store</span>
            <span className="footer-chip">Slice Reducer</span>
            <span className="footer-chip">Custom Middleware</span>
            <span className="footer-chip">Async Thunks</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
