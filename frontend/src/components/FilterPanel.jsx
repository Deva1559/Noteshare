import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterPanel = ({
  subjects = [],
  selectedSubject,
  onSubjectChange,
  selectedUnit,
  onUnitChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
        <Filter size={18} />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Filter by:</span>
      </div>

      {/* Subject Filter */}
      <div style={{ flex: '1 1 200px' }}>
        <select
          value={selectedSubject || ''}
          onChange={(e) => onSubjectChange(e.target.value ? Number(e.target.value) : null)}
          className="form-select"
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.code} - {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Unit Filter */}
      <div style={{ flex: '0 1 140px' }}>
        <select
          value={selectedUnit || ''}
          onChange={(e) => onUnitChange(e.target.value ? Number(e.target.value) : null)}
          className="form-select"
        >
          <option value="">All Units</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((unitNum) => (
            <option key={unitNum} value={unitNum}>
              Unit {unitNum}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div style={{ flex: '1 1 200px' }}>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="form-select"
        >
          <option value="createdAt,desc">Newest Uploads</option>
          <option value="createdAt,asc">Oldest Uploads</option>
          <option value="rating,desc">Highest Rated</option>
          <option value="downloads,desc">Most Downloaded</option>
        </select>
      </div>

      {/* Reset Button */}
      {(selectedSubject || selectedUnit || sortBy !== 'createdAt,desc') && (
        <button
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
