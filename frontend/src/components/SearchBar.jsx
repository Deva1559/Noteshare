import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search by note title, subject, description or unit...' }) => {
  const [keyword, setKeyword] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '1rem',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className="form-input"
          style={{ paddingLeft: '2.75rem', paddingRight: '5.5rem' }}
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '4.75rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ position: 'absolute', right: '0.4rem' }}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
