import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Upload,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldAlert,
  Compass,
  LayoutDashboard,
  Layers,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>
          <span>NotesShare</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Compass size={17} />
                <span>Explore Notes</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/subjects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={17} />
                <span>Subjects</span>
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Upload size={17} />
                    <span>Upload</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <BookOpen size={17} />
                    <span>My Notes</span>
                  </NavLink>
                </li>

                {isAdmin && (
                  <li>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      <ShieldAlert size={17} color="#c084fc" />
                      <span style={{ color: '#c084fc', fontWeight: 600 }}>Admin</span>
                    </NavLink>
                  </li>
                )}

                <li>
                  <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <User size={17} />
                    <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                  </NavLink>
                </li>

                <li>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    <LogIn size={16} />
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    <UserPlus size={16} />
                    <span>Register</span>
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
