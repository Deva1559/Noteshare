import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Users, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const fetchStudents = async (pageNumber) => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getStudents(pageNumber, 15);
      setStudents(res.data.content || []);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setError('Failed to fetch student directory.');
    } finally {
      setLoading(false);
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
        <Users size={24} color="#c084fc" />
        <h1 style={{ fontSize: '1.85rem' }}>Registered Students Directory</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Total of {totalElements} registered campus students and administrators
      </p>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="glass-card" style={{ padding: '1.75rem' }}>
        {loading ? (
          <LoadingSpinner message="Loading student roster..." />
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Department</th>
                    <th style={{ padding: '0.75rem' }}>Year</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>#{student.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{student.name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{student.email}</td>
                      <td style={{ padding: '0.75rem' }}>{student.department || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>{student.year ? `Year ${student.year}` : 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${student.role === 'ADMIN' ? 'badge-admin' : 'badge-primary'}`}>
                          {student.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No students found.
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

export default AdminStudents;
