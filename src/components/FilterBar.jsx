import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilterName,
  setFilterStatus,
  setFilterGender,
  resetFilters,
  selectCharacterFilters,
} from '../features/characters/charactersSlice';
import { Search, RotateCcw, Filter } from 'lucide-react';

export default function FilterBar() {
  const dispatch = useDispatch();
  const filters = useSelector(selectCharacterFilters);

  return (
    <div className="filter-card">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} className="accent-icon" />
          <span>Multiverse Filters</span>
        </div>
        {(filters.name || filters.status || filters.gender) && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="reset-btn"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="filter-grid">
        {/* Search input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search character name (e.g. Rick, Morty)..."
            value={filters.name}
            onChange={(e) => dispatch(setFilterName(e.target.value))}
            className="search-input"
          />
        </div>

        {/* Status selector */}
        <div className="select-wrapper">
          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilterStatus(e.target.value))}
            className="custom-select"
          >
            <option value="">All Life Statuses</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Gender selector */}
        <div className="select-wrapper">
          <select
            value={filters.gender}
            onChange={(e) => dispatch(setFilterGender(e.target.value))}
            className="custom-select"
          >
            <option value="">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
    </div>
  );
}
