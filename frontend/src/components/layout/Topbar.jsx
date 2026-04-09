import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsList, BsSearch, BsBellFill, BsPersonCircle,
  BsBoxArrowRight, BsGearFill, BsShieldFill, BsX,
  BsEnvelope, BsCheckCircle, BsExclamationCircle, BsInfoCircle,
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

const SAMPLE_NOTIFICATIONS = [
  { id: 1, icon: <BsCheckCircle />, iconColor: 'var(--pass-green)', title: '5 questions imported', desc: 'Batch import completed successfully.', time: '2 min ago', read: false },
  { id: 2, icon: <BsExclamationCircle />, iconColor: '#f0a500', title: 'Exam config updated', desc: 'SSC Math config was modified.', time: '1 hr ago', read: false },
  { id: 3, icon: <BsEnvelope />, iconColor: 'var(--accent)', title: 'New user registered', desc: 'john@example.com joined as Student.', time: '3 hr ago', read: true },
];

/* ── Small reusable overlay modal ── */
function Modal({ title, onClose, children, width = 420 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--card-bg)', borderRadius: 14,
        border: '1px solid var(--border-color)',
        width: '100%', maxWidth: width, maxHeight: '90vh',
        overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)',
        }}>
          <h6 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{title}</h6>
          <button className="btn-icon" onClick={onClose}><BsX /></button>
        </div>
        <div style={{ padding: '1.25rem' }}>{children}</div>
      </div>
    </div>
  );
}

function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [modal, setModal] = useState(null); // 'profile' | 'settings' | null

  /* form state for profile & settings */
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@quaarks.com',
    phone: '',
    bio: '',
  });
  const [settingsForm, setSettingsForm] = useState({
    theme: 'dark',
    language: 'en',
    emailNotif: true,
    twoFactor: false,
  });

  const dropRef = useRef(null);
  const notifRef = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  const unread = notifications.filter((n) => !n.read).length;

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id) => setNotifications((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const openModal = (which) => { setModal(which); setDropdownOpen(false); };
  const closeModal = () => setModal(null);

  /* ── Profile save (stub — wire to your Redux action) ── */
  const handleProfileSave = (e) => {
    e.preventDefault();
    // dispatch(updateProfile(profileForm));
    closeModal();
  };

  /* ── Settings save (stub) ── */
  const handleSettingsSave = (e) => {
    e.preventDefault();
    // dispatch(updateSettings(settingsForm));
    closeModal();
  };

  return (
    <>
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
          {/* ── Notification bell ── */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="topbar-icon-btn"
              title="Notifications"
              onClick={() => { setNotifOpen((o) => !o); setDropdownOpen(false); }}
            >
              <BsBellFill />
              {unread > 0 && <span className="notif-badge">{unread}</span>}
            </button>

            {notifOpen && (
              <div className="topbar-dropdown" style={{ width: 320, right: 0, left: 'auto' }}>
                <div className="topbar-dropdown-header" style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Notifications</span>
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ fontSize: '0.72rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="topbar-dropdown-divider" />
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      padding: '0.65rem 1rem', cursor: 'pointer',
                      background: n.read ? 'transparent' : 'rgba(79,110,247,0.05)',
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(79,110,247,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: n.iconColor, fontSize: '0.9rem', flexShrink: 0,
                    }}>
                      {n.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '0.82rem', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>{n.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.7 }}>{n.time}</div>
                    </div>
                    {!n.read && (
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', marginTop: 5, flexShrink: 0 }} />
                    )}
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    No notifications
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── User dropdown ── */}
          <div className="topbar-user-wrap" ref={dropRef}>
            <button
              className="topbar-user-btn"
              onClick={() => { setDropdownOpen((o) => !o); setNotifOpen(false); }}
              title={user?.name || 'Admin'}
            >
              <div className="topbar-avatar">{initials}</div>
              <div className="topbar-user-meta">
                <span className="topbar-user-name">{user?.name || 'Admin User'}</span>
                <span className="topbar-user-role">{user?.role || 'Admin'}</span>
              </div>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 4, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                <path d="M1 1l4 4 4-4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="topbar-dropdown">
                <div className="topbar-dropdown-header">
                  <div className="topbar-dropdown-avatar">{initials}</div>
                  <div>
                    <div className="topbar-dropdown-name">{user?.name || 'Admin User'}</div>
                    <div className="topbar-dropdown-email">{user?.email || 'admin@quaarks.com'}</div>
                  </div>
                </div>
                <div className="topbar-dropdown-divider" />

                <button className="topbar-dropdown-item" onClick={() => openModal('profile')}>
                  <BsPersonCircle />
                  <span>My Profile</span>
                </button>
                <button className="topbar-dropdown-item" onClick={() => openModal('settings')}>
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

      {/* ── My Profile Modal ── */}
      {modal === 'profile' && (
        <Modal title="My Profile" onClose={closeModal}>
          <form onSubmit={handleProfileSave}>
            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 700,
              }}>
                {initials}
              </div>
            </div>

            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email Address', key: 'email', type: 'email' },
              { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+880...' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '0.9rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={profileForm[key]}
                  placeholder={placeholder || ''}
                  onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
                    border: '1px solid var(--border-color)', background: 'var(--main-bg)',
                    color: 'var(--text-primary)', fontSize: '0.85rem', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Bio
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                placeholder="Short bio..."
                onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                style={{
                  width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
                  border: '1px solid var(--border-color)', background: 'var(--main-bg)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline-custom" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn-primary-custom">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Settings Modal ── */}
      {modal === 'settings' && (
        <Modal title="Settings" onClose={closeModal}>
          <form onSubmit={handleSettingsSave}>
            {/* Theme */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Theme
              </label>
              <select
                value={settingsForm.theme}
                onChange={(e) => setSettingsForm((f) => ({ ...f, theme: e.target.value }))}
                style={{
                  width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
                  border: '1px solid var(--border-color)', background: 'var(--main-bg)',
                  color: 'var(--text-primary)', fontSize: '0.85rem',
                }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System Default</option>
              </select>
            </div>

            {/* Language */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Language
              </label>
              <select
                value={settingsForm.language}
                onChange={(e) => setSettingsForm((f) => ({ ...f, language: e.target.value }))}
                style={{
                  width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
                  border: '1px solid var(--border-color)', background: 'var(--main-bg)',
                  color: 'var(--text-primary)', fontSize: '0.85rem',
                }}
              >
                <option value="en">English</option>
                <option value="bn">Bengali</option>
              </select>
            </div>

            {/* Toggles */}
            {[
              { label: 'Email Notifications', key: 'emailNotif', desc: 'Receive updates via email' },
              { label: 'Two-Factor Authentication', key: 'twoFactor', desc: 'Add extra security to your account' },
            ].map(({ label, key, desc }) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)',
                marginBottom: '0.5rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={settingsForm[key]}
                    onChange={(e) => setSettingsForm((f) => ({ ...f, [key]: e.target.checked }))}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', inset: 0,
                    background: settingsForm[key] ? 'var(--accent)' : 'var(--border-color)',
                    borderRadius: 22, transition: '0.25s',
                  }}>
                    <span style={{
                      position: 'absolute', content: '""',
                      height: 16, width: 16, left: settingsForm[key] ? 20 : 3, bottom: 3,
                      background: '#fff', borderRadius: '50%', transition: '0.25s',
                    }} />
                  </span>
                </label>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn-outline-custom" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn-primary-custom">Save Settings</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default Topbar;