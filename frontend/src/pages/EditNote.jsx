import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { subjectService } from '../services/subjectService';
import { Edit, FileText, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unit: 1,
    subjectId: '',
  });
  const [currentFileName, setCurrentFileName] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, noteRes] = await Promise.all([
        subjectService.getSubjects(),
        noteService.getNoteById(id),
      ]);

      setSubjects(subjectsRes.data || []);
      const note = noteRes.data;
      setFormData({
        title: note.title,
        description: note.description || '',
        unit: note.unit,
        subjectId: note.subjectId,
      });
      setCurrentFileName(note.fileName);
    } catch (err) {
      setError('Could not load note data. You may not be authorized.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'unit' || name === 'subjectId' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds maximum limit of 50MB');
        return;
      }
      setNewFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description ? formData.description.trim() : '');
      data.append('unit', formData.unit);
      data.append('subjectId', formData.subjectId);
      if (newFile) {
        data.append('file', newFile);
      }

      await noteService.updateNote(id, data);
      navigate(`/notes/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update note.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading note for editing..." />;
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <Link
        to={`/notes/${id}`}
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
        <span>Cancel and return to note</span>
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="brand-icon" style={{ width: '42px', height: '42px' }}>
            <Edit size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.65rem' }}>Update Note Details</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Modify note metadata or replace the attached document
            </p>
          </div>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <select
                name="subjectId"
                required
                value={formData.subjectId}
                onChange={handleInputChange}
                className="form-select"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit *</label>
              <select
                name="unit"
                required
                value={formData.unit}
                onChange={handleInputChange}
                className="form-select"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((u) => (
                  <option key={u} value={u}>
                    Unit {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Topics</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Attached Document</label>
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={20} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.9rem' }}>Current file: <strong>{currentFileName}</strong></span>
              </div>
            </div>

            <label className="form-label" style={{ fontSize: '0.85rem' }}>
              Optionally upload replacement document (leave empty to keep current file):
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={handleFileChange}
              className="form-input"
            />
            {newFile && (
              <p style={{ fontSize: '0.85rem', color: '#34d399', marginTop: '0.4rem' }}>
                New file selected: {newFile.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
          >
            <span>{saving ? 'Saving Changes...' : 'Save and Update Note'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
