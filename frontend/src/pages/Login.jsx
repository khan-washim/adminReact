import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsEyeFill, BsEyeSlashFill, BsShieldFill, BsExclamationCircleFill } from 'react-icons/bs';
import { loginUser, clearError } from '../store/slices/authSlice.js';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // If already logged in, redirect
  useEffect(() => {
    if (token) navigate('/', { replace: true });
  }, [token, navigate]);

  // Clear API error when user types
  useEffect(() => {
    if (error) dispatch(clearError());
  }, [email, password]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 4;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || !passwordValid) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-page">
      {/* Animated grid background */}
      <div className="login-bg">
        <div className="login-bg-grid" />
        <div className="login-bg-glow glow-1" />
        <div className="login-bg-glow glow-2" />
        <div className="login-bg-glow glow-3" />
      </div>

      {/* Floating orbs */}
      <div className="login-orb orb-1" />
      <div className="login-orb orb-2" />
      <div className="login-orb orb-3" />

      <div className="login-container">
        {/* Left panel — branding */}
        <div className="login-left">
          <div className="login-brand-mark">
            <BsShieldFill />
          </div>
          <h1 className="login-headline">
            React<span>Admin</span>
          </h1>
          <p className="login-tagline">Exam Management Platform</p>

          <div className="login-feature-list">
            {[
              { icon: '📚', text: 'Manage 1,000+ exam questions' },
              { icon: '📊', text: 'Real-time analytics & reports' },
              { icon: '👥', text: 'Multi-role user management' },
              { icon: '⚙️', text: 'Flexible exam configuration' },
            ].map((f) => (
              <div key={f.text} className="login-feature-item">
                <span className="login-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="login-stats-row">
            {[
              { value: '1.2K+', label: 'Questions' },
              { value: '340+', label: 'Users' },
              { value: '5.6K+', label: 'Attempts' },
            ].map((s) => (
              <div key={s.label} className="login-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-card-icon">
                <BsShieldFill />
              </div>
              <h2>Welcome back, its your admin panel</h2>
              <p>Sign in to your admin account</p>
            </div>

            {/* Demo credentials hint */}
            <div className="login-demo-hint">
              <span className="login-demo-label">Demo credentials</span>
              <code>admin@gmail.com</code>
              <span style={{ color: 'var(--text-muted)', margin: '0 0.25rem' }}>/</span>
              <code>admin123</code>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="login-field-group">
                <label className="login-label">Email Address</label>
                <div className={`login-input-wrap ${touched.email && !emailValid ? 'error' : touched.email && emailValid ? 'valid' : ''}`}>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="admin@quaarks.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    autoComplete="email"
                  />
                  {touched.email && emailValid && (
                    <span className="login-field-check">✓</span>
                  )}
                </div>
                {touched.email && !emailValid && (
                  <span className="login-field-error">Please enter a valid email address</span>
                )}
              </div>

              {/* Password */}
              <div className="login-field-group">
                <label className="login-label">Password</label>
                <div className={`login-input-wrap ${touched.password && !passwordValid ? 'error' : touched.password && passwordValid ? 'valid' : ''}`}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPass((s) => !s)}
                    tabIndex={-1}
                  >
                    {showPass ? <BsEyeSlashFill /> : <BsEyeFill />}
                  </button>
                </div>
                {touched.password && !passwordValid && (
                  <span className="login-field-error">Password must be at least 4 characters</span>
                )}
              </div>

              {/* API Error */}
              {error && (
                <div className="login-api-error">
                  <BsExclamationCircleFill />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            <p className="login-footer-note">
              Protected by JWT authentication. Session expires in 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
