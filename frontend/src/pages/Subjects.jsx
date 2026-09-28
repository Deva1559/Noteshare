import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectService } from '../services/subjectService';
import { useAuth } from '../context/AuthContext';
import { Layers, BookOpen, ArrowRight, Settings } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Subjects = () => {
  const { isAdmin } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectService.getSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      setError('Failed to load academic subjects.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading academic subject catalog..." />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Layers size={24} color="var(--accent-primary)" />
            <h1 style={{ fontSize: '1.85rem' }}>Academic Subjects</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Browse curated syllabus notes and exam guides organized by engineering courses
          </p>
        </div>

        {isAdmin && (
          <Link to="/admin/subjects" className="btn btn-secondary">
            <Settings size={16} />
            <span>Manage Subjects</span>
          </Link>
        )}
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="grid-cards">
        {subjects.map((sub) => (
          <div key={sub.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-primary">{sub.code}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <BookOpen size={14} />
                  <span>{sub.noteCount || 0} notes</span>
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                {sub.name}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {sub.description || 'Core departmental syllabus coverage and unit-wise lecture notes.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem', marginTop: 'auto' }}>
              <Link
                to={`/notes?subjectId=${sub.id}`}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Browse {sub.code} Notes</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
