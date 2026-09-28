import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectService } from '../../services/subjectService';
import { Layers, Plus, Edit, Trash2, ArrowLeft, Check, X } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await subjectService.getSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      setError('Could not load academic subjects.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({ name: '', code: '', description: '' });
    setModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSubject(null);
    setFormData({ name: '', code: '', description: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSaving(true);
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject.id, formData);
        setSuccess('Subject updated successfully.');
      } else {
        await subjectService.createSubject(formData);
        setSuccess('Subject created successfully.');
      }
      closeModal();
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete subject "${name}"? All associated notes will also be affected.`)) {
      return;
    }
    try {
      await subjectService.deleteSubject(id);
      setSuccess('Subject deleted successfully.');
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subject.');
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Layers size={24} color="#c084fc" />
            <h1 style={{ fontSize: '1.85rem' }}>Subject Management</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Add, update, or remove courses in the departmental curriculum
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Subject</span>
        </button>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', justifyContent: 'space-between' }}>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="glass-card" style={{ padding: '1.75rem' }}>
        {loading ? (
          <LoadingSpinner message="Loading course subjects..." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Code</th>
                  <th style={{ padding: '0.75rem' }}>Subject Name</th>
                  <th style={{ padding: '0.75rem' }}>Description</th>
                  <th style={{ padding: '0.75rem' }}>Notes Count</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {sub.code}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{sub.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                      {sub.description || 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{sub.noteCount || 0}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEditModal(sub)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Subject"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id, sub.name)}
                          className="btn btn-danger btn-sm"
                          title="Delete Subject"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem' }}>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Subject Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS401"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Networks"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Course scope and objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editingSubject ? 'Update Subject' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubjects;
