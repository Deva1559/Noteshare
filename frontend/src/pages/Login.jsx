import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, BookOpen, AlertCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('expired') === 'true';

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className="brand-icon"
            style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}
          >
            <BookOpen size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to access and share academic notes
          </p>
        </div>

        {sessionExpired && (
          <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>Your session has expired. Please sign in again.</span>
          </div>
        )}

        <ErrorMessage message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@notesshare.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <LogIn size={18} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials for Viva / Evaluation */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-glass)',
            fontSize: '0.825rem',
          }}
        >
          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            Quick Demo Login (Password: <code>Password@123</code>):
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@notesshare.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('deva@notesshare.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Deva (Student)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('ranjan@notesshare.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Ranjan (Student)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
