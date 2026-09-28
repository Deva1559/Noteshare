import React from 'react';
import NoteCard from './NoteCard';
import { FileQuestion } from 'lucide-react';

const NoteGrid = ({ notes = [], emptyMessage = 'No notes found matching your criteria.' }) => {
  if (!notes || notes.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '3.5rem 1.5rem',
          margin: '1.5rem 0',
        }}
      >
        <FileQuestion size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Nothing here yet</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NoteGrid;
