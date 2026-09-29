import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPage,
  selectCharacterFilters,
} from '../features/characters/charactersSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ totalPages = 1, count = 0 }) {
  const dispatch = useDispatch();
  const filters = useSelector(selectCharacterFilters);

  const currentPage = filters.page || 1;

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <button
        disabled={currentPage <= 1}
        onClick={() => dispatch(setPage(currentPage - 1))}
        className="pagination-btn"
      >
        <ChevronLeft size={18} />
        <span>Previous</span>
      </button>

      <div className="pagination-indicator">
        Page <span className="highlight">{currentPage}</span> of{' '}
        <span className="highlight">{totalPages}</span> ({count} Total Records)
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => dispatch(setPage(currentPage + 1))}
        className="pagination-btn"
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
