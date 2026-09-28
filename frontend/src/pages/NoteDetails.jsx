import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/noteService';
import { ratingService } from '../services/ratingService';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  FileText,
  Download,
  Calendar,
  User,
  Star,
  Edit,
  Trash2,
  CheckCircle,
  ArrowLeft,
  HardDrive,
  Check,
  AlertTriangle,
} from 'lucide-react';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await noteService.getNoteById(id);
      setNote(res.data);
    } catch (err) {
      setError('Could not load note details. It may have been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await noteService.downloadNote(note.id, note.fileName);
      setNote((prev) => ({
        ...prev,
        downloadCount: (prev.downloadCount || 0) + 1,
      }));
    } catch (err) {
      setError('Failed to download file. Please check if the file exists on the server.');
    } finally {
      setDownloading(false);
    }
  };

  const handleRate = async (starValue) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (note.userRating) {
      setError('You have already rated this note.');
      return;
    }

    try {
      setRatingSubmitting(true);
      setError('');
      const res = await ratingService.rateNote(note.id, starValue);
      setSuccessMessage('Thank you! Your rating has been recorded.');
      setNote((prev) => ({
        ...prev,
        averageRating: res.data.newAverageRating,
        totalRatings: (prev.totalRatings || 0) + 1,
        userRating: starValue,
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not record rating.';
      setError(msg);
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await noteService.deleteNote(note.id);
      navigate('/notes', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note.');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <LoadingSpinner message="Loading note details..." />;
  }

  if (!note) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <ErrorMessage message={error || 'Note not found.'} />
        <Link to="/notes" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Notes
        </Link>
      </div>
    );
  }

  const isOwner = user && note.uploaderId && Number(user.id) === Number(note.uploaderId);
  const canModify = isOwner || isAdmin;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <Link
        to="/notes"
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
        <span>Back to all notes</span>
      </Link>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {successMessage && (
        <div className="alert alert-success" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Details Card */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{note.subjectCode} - {note.subjectName}</span>
            <span className="badge badge-warning">Unit {note.unit}</span>
            {isOwner && <span className="badge badge-success">Your Note</span>}
          </div>

          {canModify && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link to={`/notes/${note.id}/edit`} className="btn btn-secondary btn-sm">
                <Edit size={14} />
                <span>Edit</span>
              </Link>
              <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm">
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.3 }}>
          {note.title}
        </h1>

        {note.description ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', whiteSpace: 'pre-line', marginBottom: '2rem', lineHeight: 1.7 }}>
            {note.description}
          </p>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '2rem' }}>
            No additional description provided.
          </p>
        )}

        {/* Note Metadata Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem',
            background: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Uploader</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <User size={15} color="var(--accent-primary)" />
              <span>{note.uploaderName}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Upload Date</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <Calendar size={15} color="var(--accent-primary)" />
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>File Info</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <HardDrive size={15} color="var(--accent-primary)" />
              <span>{formatFileSize(note.fileSize)}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Downloads</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#34d399' }}>
              <Download size={15} />
              <span>{note.downloadCount} times</span>
            </div>
          </div>
        </div>

        {/* Download Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1.25rem',
            background: 'var(--accent-gradient-glow)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={28} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 600 }}>{note.fileName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Format: {note.fileType || 'Document'} • Size: {formatFileSize(note.fileSize)}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <Download size={18} />
            <span>{downloading ? 'Downloading...' : 'Download Document'}</span>
          </button>
        </div>
      </div>

      {/* Ratings & Feedback Card */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star size={22} color="#fbbf24" />
          <span>Student Rating & Reviews</span>
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>
              {Number(note.averageRating || 0).toFixed(1)}
            </div>
            <RatingStars rating={note.averageRating || 0} size={18} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Based on {note.totalRatings || 0} rating(s)
            </div>
          </div>

          {/* Interactive Rating Area */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Rate this Academic Note</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              Help your peers find the most accurate and high-yield notes.
            </p>

            {note.userRating ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#86efac',
                  fontSize: '0.9rem',
                }}
              >
                <Check size={18} />
                <span>You rated this note <strong>{note.userRating} out of 5 stars</strong></span>
              </div>
            ) : isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <RatingStars
                  interactive={true}
                  onRate={handleRate}
                  size={26}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {ratingSubmitting ? 'Submitting rating...' : 'Click star to rate (1 - 5)'}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Please <Link to="/login" style={{ fontWeight: 600 }}>sign in</Link> to rate this note.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171', marginBottom: '1rem' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.25rem' }}>Delete this Note?</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Are you sure you want to permanently delete <strong>"{note.title}"</strong>? This will remove the file and all associated ratings permanently.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetails;
