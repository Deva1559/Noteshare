import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noteService } from '../services/noteService';
import NoteGrid from '../components/NoteGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BookOpen, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyNotes(page);
  }, [page]);

  const fetchMyNotes = async (pageNumber) => {
    try {
      setLoading(true);
      setError('');
      const res = await noteService.getMyNotes(pageNumber, 9);
      setNotes(res.data.content || []);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError('Could not load your uploaded notes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
            <h1 style={{ fontSize: '1.85rem' }}>My Uploaded Notes</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage, update, and track downloads for your contributions ({totalElements} notes)
          </p>
        </div>

        <Link to="/upload" className="btn btn-primary">
          <Upload size={16} />
          <span>Upload Another Note</span>
        </Link>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner message="Fetching your notes..." />
      ) : (
        <>
          <NoteGrid
            notes={notes}
            emptyMessage="You haven't uploaded any notes yet. Click 'Upload Another Note' to share your first study guide!"
          />

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i ? 'active' : ''}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyNotes;
