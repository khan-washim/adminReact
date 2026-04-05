import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsSpeedometer2, BsQuestionCircle, BsPeopleFill, BsUpload,
  BsBookHalf, BsGearFill, BsTagFill, BsPersonFill, BsShieldFill,
  BsBoxArrowRight,
} from 'react-icons/bs';
import { closeSidebar } from '../../store/slices/uiSlice.js';
import { logout } from '../../store/slices/authSlice.js';

const navGroups = [
  {
    label: 'Main',
    links: [
      { to: '/', icon: <BsSpeedometer2 />, label: 'Dashboard', exact: true },
    ],
  },
  {
    label: 'Questions',
    links: [
      { to: '/question-bank', icon: <BsQuestionCircle />, label: 'Question Bank' },
      { to: '/user-questions', icon: <BsPeopleFill />, label: 'User Questions' },
      { to: '/import-questions', icon: <BsUpload />, label: 'Import Questions' },
    ],
  },
  {
    label: 'Configuration',
    links: [
      { to: '/subjects', icon: <BsBookHalf />, label: 'Subjects' },
      { to: '/exam-configs', icon: <BsGearFill />, label: 'Exam Configs' },
      { to: '/exam-types', icon: <BsTagFill />, label: 'Exam Types' },
    ],
  },
  {
    label: 'Administration',
    links: [
      { to: '/users', icon: <BsPersonFill />, label: 'Users' },
    ],
  },
];

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const { user } = useSelector((s) => s.auth);

  const handleLinkClick = () => {
    if (window.innerWidth < 992) dispatch(closeSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="d-flex align-items-center gap-2">
          <BsShieldFill style={{ color: 'var(--accent)', fontSize: '1.3rem' }} />
          <h5 className="mb-0">
            react<span>admin</span>
          </h5>
        </div>
        <small style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem' }}>Admin Dashboard</small>
      </div>

      {/* Nav Groups */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="sidebar-section-label">{group.label}</div>
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                onClick={handleLinkClick}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span>{user?.name || 'Admin User'}</span>
            <small>{user?.role || 'Admin'}</small>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >
            <BsBoxArrowRight />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
