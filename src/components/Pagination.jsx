import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPage,
  selectCharacterInfo,
  selectCharacterFilters,
} from '../features/characters/charactersSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  const dispatch = useDispatch();
  const info = useSelector(selectCharacterInfo);
  const filters = useSelector(selectCharacterFilters);

  const currentPage = filters.page || 1;
  const totalPages = info.pages || 1;

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
        <span className="highlight">{totalPages}</span> ({info.count} Total Records)
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
