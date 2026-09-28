import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { noteService } from '../../services/noteService';
import {
  Users,
  FileText,
  Layers,
  Star,
  Download,
  Trash2,
  Shield,
  ArrowRight,
  Eye,
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getDashboard();
      setData(res.data);
    } catch (err) {
      setError('Could not load administrative metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove note "${title}" as an administrator?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await adminService.deleteNote(id);
      fetchDashboard();
    } catch (err) {
      alert('Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading administrative metrics..." />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Shield size={24} color="#c084fc" />
            <h1 style={{ fontSize: '1.85rem' }}>Administrator Console</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            System-wide analytics, content moderation, subject catalog and user management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/students" className="btn btn-secondary btn-sm">
            <Users size={15} />
            <span>Manage Students</span>
          </Link>
          <Link to="/admin/subjects" className="btn btn-secondary btn-sm">
            <Layers size={15} />
            <span>Manage Subjects</span>
          </Link>
          <Link to="/admin/notes" className="btn btn-primary btn-sm">
            <FileText size={15} />
            <span>Moderate Notes</span>
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Admin KPI Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#c084fc', background: 'rgba(139, 92, 246, 0.15)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.totalStudents || 0}</div>
            <div className="stat-label">Registered Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.totalNotes || 0}</div>
            <div className="stat-label">Total Notes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.totalSubjects || 0}</div>
            <div className="stat-label">Course Subjects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)' }}>
            <Star size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.totalRatings || 0}</div>
            <div className="stat-label">Ratings Submitted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.15)' }}>
            <Download size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.totalDownloads || 0}</div>
            <div className="stat-label">Total Downloads</div>
          </div>
        </div>
      </div>

      {/* Recent Notes Moderation Table */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Recent Uploads for Moderation</h2>
          <Link to="/admin/notes" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>View All Notes</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Title</th>
                <th style={{ padding: '0.75rem' }}>Subject</th>
                <th style={{ padding: '0.75rem' }}>Uploader</th>
                <th style={{ padding: '0.75rem' }}>Rating</th>
                <th style={{ padding: '0.75rem' }}>Downloads</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentNotes?.map((note) => (
                <tr key={note.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{note.title}</td>
                  <td style={{ padding: '0.75rem' }}>{note.subjectCode}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{note.uploaderName}</td>
                  <td style={{ padding: '0.75rem' }}>★ {Number(note.averageRating || 0).toFixed(1)}</td>
                  <td style={{ padding: '0.75rem' }}>{note.downloadCount}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <Link to={`/notes/${note.id}`} className="btn btn-secondary btn-sm" title="View Note">
                        <Eye size={13} />
                      </Link>
                      <button
                        onClick={() => handleDeleteNote(note.id, note.title)}
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
              {(!data?.recentNotes || data.recentNotes.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No uploaded notes recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
