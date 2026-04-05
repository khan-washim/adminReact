import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsList, BsSearch, BsBellFill, BsPersonCircle,
  BsBoxArrowRight, BsGearFill, BsShieldFill,
} from 'react-icons/bs';
import { toggleSidebar } from '../../store/slices/uiSlice.js';
import { logout } from '../../store/slices/authSlice.js';

const routeTitles = {
  '/': 'Dashboard',
  '/question-bank': 'Question Bank',
  '/user-questions': 'User Questions',
  '/import-questions': 'Import Questions',
  '/subjects': 'Subjects',
  '/exam-configs': 'Exam Configurations',
  '/exam-types': 'Exam Types',
  '/users': 'User Management',
};

function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const title = routeTitles[location.pathname] || 'Page';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={() => dispatch(toggleSidebar())}>
          <BsList />
        </button>
        <div className="topbar-search">
          <BsSearch className="search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Notifications">
          <BsBellFill />
          <span className="notif-badge">3</span>
        </button>

        {/* User dropdown */}
        <div className="topbar-user-wrap" ref={dropRef}>
          <button
            className="topbar-user-btn"
            onClick={() => setDropdownOpen((o) => !o)}
            title={user?.name || 'Admin'}
          >
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-meta">
              <span className="topbar-user-name">{user?.name || 'Admin User'}</span>
              <span className="topbar-user-role">{user?.role || 'Admin'}</span>
            </div>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 4, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M1 1l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              {/* User info header */}
              <div className="topbar-dropdown-header">
                <div className="topbar-dropdown-avatar">{initials}</div>
                <div>
                  <div className="topbar-dropdown-name">{user?.name || 'Admin User'}</div>
                  <div className="topbar-dropdown-email">{user?.email || 'admin@quaarks.com'}</div>
                </div>
              </div>
              <div className="topbar-dropdown-divider" />

              <button className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <BsPersonCircle />
                <span>My Profile</span>
              </button>
              <button className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <BsGearFill />
                <span>Settings</span>
              </button>
              <button className="topbar-dropdown-item" onClick={() => { navigate('/users'); setDropdownOpen(false); }}>
                <BsShieldFill />
                <span>User Management</span>
              </button>

              <div className="topbar-dropdown-divider" />

              <button className="topbar-dropdown-item logout" onClick={handleLogout}>
                <BsBoxArrowRight />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
