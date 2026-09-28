import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { subjectService } from '../services/subjectService';
import { Upload, FileText, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const UploadNote = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unit: 1,
    subjectId: '',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getSubjects();
      setSubjects(res.data || []);
      if (res.data && res.data.length > 0) {
        setFormData((prev) => ({ ...prev, subjectId: res.data[0].id }));
      }
    } catch (err) {
      setError('Could not load academic subjects. Please ensure backend is running.');
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
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate size (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds maximum limit of 50MB');
      return;
    }

    // Validate extension
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'];
    if (!allowed.includes(ext)) {
      setError(`File type .${ext} is not allowed. Supported formats: ${allowed.join(', ')}`);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Note title is required');
      return;
    }

    if (!formData.subjectId) {
      setError('Please select an academic subject');
      return;
    }

    if (!file) {
      setError('Please attach a document file');
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description ? formData.description.trim() : '');
      data.append('unit', formData.unit);
      data.append('subjectId', formData.subjectId);
      data.append('file', file);

      const res = await noteService.uploadNote(data);
      navigate(`/notes/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload note. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
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
        <span>Back to notes</span>
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="brand-icon" style={{ width: '42px', height: '42px' }}>
            <Upload size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.65rem' }}>Upload Academic Note</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Share syllabus notes with fellow students
            </p>
          </div>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              name="title"
              required
              minLength={3}
              maxLength={200}
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Unit 3 - B-Trees, AVL Trees and Heaps Complete Guide"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Subject */}
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

            {/* Unit */}
            <div className="form-group">
              <label className="form-label">Unit Number *</label>
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

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Topics Covered</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Key concepts, important exam questions, solved numericals, or lecture summaries..."
              className="form-textarea"
            />
          </div>

          {/* File Picker */}
          <div className="form-group">
            <label className="form-label">Document File (PDF, DOC, DOCX, PPT, PPTX, TXT) *</label>
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('noteFileInput').click()}
            >
              <FileText size={36} color="var(--accent-primary)" style={{ margin: '0 auto 0.75rem' }} />
              <input
                id="noteFileInput"
                type="file"
                required
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {file ? (
                <div>
                  <p style={{ fontWeight: 600, color: '#34d399', marginBottom: '0.25rem' }}>
                    ✓ {file.name}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                    Click here to select document from your device
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Maximum file size: 50MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
          >
            <Upload size={18} />
            <span>{uploading ? 'Uploading Note...' : 'Publish Note to Repository'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNote;
