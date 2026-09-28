import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noteService } from '../../services/noteService';
import { adminService } from '../../services/adminService';
import { FileText, ArrowLeft, Trash2, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchNotes(page);
  }, [page]);

  const fetchNotes = async (pageNumber) => {
    try {
      setLoading(true);
      setError('');
      const res = await noteService.getNotes({ page: pageNumber, size: 12, sort: 'createdAt,desc' });
      setNotes(res.data.content || []);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError('Could not load notes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently remove note "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      setDeletingId(id);
      await adminService.deleteNote(id);
      fetchNotes(page);
    } catch (err) {
      alert('Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <Link
        to="/admin/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Admin Console</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <FileText size={24} color="#c084fc" />
        <h1 style={{ fontSize: '1.85rem' }}>Content Moderation & Notes Repository</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Review and moderate all {totalElements} student notes uploaded to the platform
      </p>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="glass-card" style={{ padding: '1.75rem' }}>
        {loading ? (
          <LoadingSpinner message="Loading notes repository..." />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Title</th>
                    <th style={{ padding: '0.75rem' }}>Subject</th>
                    <th style={{ padding: '0.75rem' }}>Unit</th>
                    <th style={{ padding: '0.75rem' }}>Uploader</th>
                    <th style={{ padding: '0.75rem' }}>Rating</th>
                    <th style={{ padding: '0.75rem' }}>Downloads</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{note.title}</td>
                      <td style={{ padding: '0.75rem' }}>{note.subjectCode}</td>
                      <td style={{ padding: '0.75rem' }}>Unit {note.unit}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{note.uploaderName}</td>
                      <td style={{ padding: '0.75rem' }}>★ {Number(note.averageRating || 0).toFixed(1)}</td>
                      <td style={{ padding: '0.75rem' }}>{note.downloadCount}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <Link to={`/notes/${note.id}`} className="btn btn-secondary btn-sm" title="View Note">
                            <Eye size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(note.id, note.title)}
                            disabled={deletingId === note.id}
                            className="btn btn-danger btn-sm"
                            title="Delete Note"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {notes.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No notes in repository.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
    </div>
  );
};

export default AdminNotes;
