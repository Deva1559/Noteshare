import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { User, Mail, Building, Calendar, Shield, Save, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: 1,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await studentService.getProfile();
      setProfile(res.data);
      setFormData({
        name: res.data.name,
        department: res.data.department || 'Computer Science',
        year: res.data.year || 1,
      });
    } catch (err) {
      setError('Could not load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSaving(true);
      const res = await studentService.updateProfile(formData);
      setProfile(res.data);
      updateUser({ name: res.data.name });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div
            className="brand-icon"
            style={{ width: '56px', height: '56px', borderRadius: '50%' }}
          >
            <User size={30} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{profile?.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${profile?.role === 'ADMIN' ? 'badge-admin' : 'badge-primary'}`}>
                {profile?.role}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {profile?.email}
              </span>
            </div>
          </div>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={profile?.email || ''}
              className="form-input"
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm.">Electronics & Comm.</option>
                <option value="Electrical Engg.">Electrical Engg.</option>
                <option value="Mechanical Engg.">Mechanical Engg.</option>
                <option value="Civil Engg.">Civil Engg.</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-select"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </span>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
