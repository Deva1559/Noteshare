import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { subjectService } from '../services/subjectService';
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
  Search,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import NoteGrid from '../components/NoteGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboard();
    fetchSubjects();
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

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getAllSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      // Non-critical if subjects fail
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/notes');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard statistics..." />;
  }

  return (
    <div>
      {/* High-Impact Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '3rem 2.5rem',
          marginBottom: '2.5rem',
          background: 'radial-gradient(ellipse at top left, #eff6ff 0%, #ffffff 70%)',
          border: '1px solid #bfdbfe',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.08)',
        }}
      >
        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              background: '#eff6ff',
              border: '1px solid #93c5fd',
              color: '#1d4ed8',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} color="#2563eb" />
            <span>Academic Peer-to-Peer Repository • Semester 2026</span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            {isAuthenticated ? (
              <>
                Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name}</span>!
              </>
            ) : (
              <>
                Smarter Study Notes, <span style={{ color: 'var(--accent-primary)' }}>Shared by Students</span>.
              </>
            )}
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '620px',
            }}
          >
            Access curated lecture notes, unit-by-unit revision modules, and past exam guides verified by peers and department toppers.
          </p>

          {/* Quick Search in Hero */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              maxWidth: '540px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '0.35rem 0.5rem',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
              marginBottom: '1.5rem',
            }}
          >
            <Search size={18} color="#64748b" style={{ marginLeft: '0.75rem', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search by topic, keyword, or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '0.5rem 0.25rem',
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.55rem 1.15rem' }}>
              <span>Search</span>
            </button>
          </form>

          {/* Quick CTA links */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/notes" className="btn btn-primary">
              <span>Browse All Notes</span>
              <ArrowRight size={16} />
            </Link>

            {isAuthenticated ? (
              <Link to="/upload" className="btn btn-secondary">
                <Upload size={16} />
                <span>Upload New Note</span>
              </Link>
            ) : (
              <Link to="/register" className="btn btn-secondary">
                <span>Create Student Account</span>
              </Link>
            )}

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                marginLeft: '0.5rem',
              }}
            >
              <CheckCircle2 size={15} color="#10b981" />
              <span>Free PDF & Document Downloads</span>
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Production Stats Counters */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-val">{dashboardData?.totalNotes || 0}</div>
            <div className="stat-label">Verified Uploads</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#6366f1', background: '#eef2ff', borderColor: '#e0e7ff' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-val">{dashboardData?.totalSubjects || 0}</div>
            <div className="stat-label">Academic Subjects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#0ea5e9', background: '#f0f9ff', borderColor: '#e0f2fe' }}>
            <Download size={24} />
          </div>
          <div>
            <div className="stat-val">{dashboardData?.totalDownloads || 0}</div>
            <div className="stat-label">Study Downloads</div>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#10b981', background: '#ecfdf5', borderColor: '#d1fae5' }}>
              <Star size={24} />
            </div>
            <div>
              <div className="stat-val">{dashboardData?.myNotesCount || 0}</div>
              <div className="stat-label">My Uploaded Notes</div>
            </div>
          </div>
        ) : (
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#f59e0b', background: '#fffbeb', borderColor: '#fef3c7' }}>
              <Zap size={24} />
            </div>
            <div>
              <div className="stat-val">100%</div>
              <div className="stat-label">Open Student Access</div>
            </div>
          </div>
        )}
      </div>

      {/* Subject Filter Pills */}
      {subjects.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Quick Filter by Subject
            </span>
            <Link to="/subjects" style={{ fontSize: '0.825rem', fontWeight: 600 }}>
              View All ({subjects.length}) →
            </Link>
          </div>
          <div className="filter-pill-container">
            <button
              onClick={() => navigate('/notes')}
              className="filter-pill active"
            >
              All Subjects
            </button>
            {subjects.slice(0, 7).map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/notes?subjectId=${s.id}`)}
                className="filter-pill"
              >
                {s.name} ({s.code})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top Rated Section */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} color="#d97706" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Top-Rated Academic Notes</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Highest evaluated notes across all semesters</p>
            </div>
          </div>
          <Link to="/notes?sort=rating,desc" className="btn btn-outline btn-sm">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        <NoteGrid notes={dashboardData?.topRatedNotes || []} emptyMessage="No rated notes yet. Be the first to upload and review notes!" />
      </div>

      {/* Recently Added Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Recently Uploaded Material</h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Fresh uploads uploaded by students this week</p>
            </div>
          </div>
          <Link to="/notes" className="btn btn-outline btn-sm">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        <NoteGrid notes={dashboardData?.recentNotes || []} emptyMessage="No notes uploaded yet. Start contributing to your department!" />
      </div>
    </div>
  );
};

export default Dashboard;
