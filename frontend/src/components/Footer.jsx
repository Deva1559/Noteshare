import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart, Github, Layers, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="brand">
              <div className="brand-icon">
                <BookOpen size={20} />
              </div>
              <span>NotesShare</span>
            </Link>
            <p className="footer-tagline">
              Peer-to-peer student academic notes repository. Built for seamless knowledge sharing, verified unit notes, and collaborative learning.
            </p>
            <div className="footer-status-pill">
              <span className="status-dot"></span>
              <span>All Systems Operational (Spring Boot + MySQL)</span>
            </div>
          </div>

          <div className="footer-nav-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/notes">Explore Notes</Link></li>
              <li><Link to="/subjects">Academic Subjects</Link></li>
              <li><Link to="/upload">Upload Material</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Students</h4>
            <ul>
              <li><Link to="/my-notes">My Uploaded Notes</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
              <li><Link to="/login">Student Sign In</Link></li>
              <li><Link to="/register">Register Free</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Architecture</h4>
            <div className="tech-stack-badges">
              <span className="tech-badge">Spring Boot 3</span>
              <span className="tech-badge">Java 17</span>
              <span className="tech-badge">React 18</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">MySQL 8.0</span>
              <span className="tech-badge">JWT Auth</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NotesShare. Academic Repository Platform.</p>
          <div className="footer-bottom-links">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Role-Based Access Control</span>
            </span>
            <span className="separator">•</span>
            <span>Layered N-Tier Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
