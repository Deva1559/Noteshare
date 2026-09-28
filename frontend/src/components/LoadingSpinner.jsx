import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
      {message && (
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
