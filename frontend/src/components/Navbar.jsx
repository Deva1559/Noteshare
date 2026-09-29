import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  PlusCircle,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Compass,
  LayoutDashboard,
  Layers,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <BookOpen size={20} />
          </div>
          <span style={{ letterSpacing: '-0.02em' }}>NotesShare</span>
          <span className="brand-badge">PROD</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Compass size={16} />
                <span>Explore Notes</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/subjects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={16} />
                <span>Subjects</span>
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/my-notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <BookOpen size={16} />
                    <span>My Notes</span>
                  </NavLink>
                </li>

                {isAdmin && (
                  <li>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      <ShieldCheck size={16} color="#7c3aed" />
                      <span style={{ color: '#7c3aed', fontWeight: 600 }}>Admin</span>
                    </NavLink>
                  </li>
                )}

                <li>
                  <NavLink to="/upload" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 0.95rem' }}>
                    <PlusCircle size={15} />
                    <span>Upload Note</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/profile"
                    className="nav-user-pill"
                    title={`Logged in as ${user?.name} (${user?.email})`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="user-avatar-initial">
                      {getInitial(user?.name)}
                    </div>
                    <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                  </NavLink>
                </li>

                <li>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    <LogIn size={15} />
                    <span>Sign In</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    <UserPlus size={15} />
                    <span>Get Started</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
