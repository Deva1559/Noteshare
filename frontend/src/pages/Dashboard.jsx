import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import {
  FileText,
  BookOpen,
  Download,
  Star,
  Upload,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import NoteGrid from '../components/NoteGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await studentService.getDashboard();
      setDashboardData(res.data);
    } catch (err) {
      setError('Failed to load dashboard metrics. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard statistics..." />;
  }

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem 2rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
          border: '1px solid #bfdbfe',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
          <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            <Sparkles size={12} />
            <span>Academic Excellence Platform</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', fontWeight: 800 }}>
            {isAuthenticated ? `Welcome back, ${user?.name}!` : 'NotesShare Academic Repository'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.75rem' }}>
            Centralized hub for semester notes, unit summaries, and study guides. Upload verified material, browse subjects, and download study notes anytime.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/notes" className="btn btn-primary">
              <span>Explore All Notes</span>
              <ArrowRight size={16} />
            </Link>
            {isAuthenticated ? (
              <Link to="/upload" className="btn btn-secondary">
                <Upload size={16} />
                <span>Upload New Note</span>
              </Link>
            ) : (
              <Link to="/register" className="btn btn-secondary">
                <span>Join Student Community</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Stats Counter Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-val">{dashboardData?.totalNotes || 0}</div>
            <div className="stat-label">Total Notes Uploaded</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-val">{dashboardData?.totalSubjects || 0}</div>
            <div className="stat-label">Academic Subjects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Download size={24} />
          </div>
          <div>
            <div className="stat-val">{dashboardData?.totalDownloads || 0}</div>
            <div className="stat-label">Total Downloads</div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.15)' }}>
              <Star size={24} />
            </div>
            <div>
              <div className="stat-val">{dashboardData?.myNotesCount || 0}</div>
              <div className="stat-label">My Uploaded Notes</div>
            </div>
          </div>
        )}
      </div>

      {/* Top Rated Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={22} color="#fbbf24" />
            <h2 style={{ fontSize: '1.4rem' }}>Top-Rated Academic Notes</h2>
          </div>
          <Link to="/notes?sort=rating,desc" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
        <NoteGrid notes={dashboardData?.topRatedNotes || []} emptyMessage="No rated notes yet. Be the first to upload and rate notes!" />
      </div>

      {/* Recently Uploaded Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.4rem' }}>Recently Uploaded Notes</h2>
          </div>
          <Link to="/notes?sort=createdAt,desc" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
        <NoteGrid notes={dashboardData?.recentNotes || []} emptyMessage="No recent notes found." />
      </div>

      {/* My Uploads Section (if authenticated and has uploads) */}
      {isAuthenticated && dashboardData?.myRecentNotes && dashboardData.myRecentNotes.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={22} color="#8b5cf6" />
              <h2 style={{ fontSize: '1.4rem' }}>My Recent Uploads</h2>
            </div>
            <Link to="/my-notes" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>Manage My Notes</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <NoteGrid notes={dashboardData.myRecentNotes} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
