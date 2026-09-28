import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger" style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
          aria-label="Dismiss error"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
