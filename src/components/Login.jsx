import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import './Login.css';

const Login = () => {
  const { user, setUser } = useFeedback();

  const [loginData, setLoginData] = useState({
    username: '',
    role: 'student',
    remember: false,
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    // Clear error when username changes
    if (error && loginData.username.trim().length > 1) setError('');
  }, [loginData.username, error]);

  // If user is already logged in, redirect to appropriate dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    if (!loginData.username || loginData.username.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return false;
    }
    if (!loginData.password || loginData.password.length < 6) {
      setError('Please enter a password (at least 6 characters).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);

    // Simulate minimal auth flow; replace with real API call as needed
    const newUser = {
      id: Date.now().toString(),
      name: loginData.username.trim(),
      role: loginData.role
    };

    try {
      // small delay to show loading state in demo
      await new Promise(res => setTimeout(res, 350));
      setUser(newUser);
      if (loginData.remember) {
        try {
          localStorage.setItem('kluerp_user', JSON.stringify(newUser));
        } catch {
          // ignore storage failures in restricted environments
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <main className="login-card" aria-labelledby="login-heading">
        <h1 id="login-heading">Student Feedback System</h1>
        <p className="lead">Sign in to manage or submit feedback</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-row">
            <label htmlFor="username">Full name</label>
            <input
              id="username"
              name="username"
              type="text"
              value={loginData.username}
              onChange={handleInputChange}
              placeholder="e.g. Jane Doe"
              aria-describedby="username-help username-error"
              autoComplete="name"
            />
            <div id="username-help" className="hint">Use the name your school uses for you.</div>
            {error && (
              <div id="username-error" className="error" aria-live="polite">{error}</div>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                aria-describedby="password-help"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(s => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div id="password-help" className="hint">Passwords are not stored in this demo.</div>
          </div>

          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={loginData.role} onChange={handleInputChange}>
              <option value="student">Student</option>
              <option value="admin">Administrator / Teacher</option>
            </select>
          </div>

          <div className="form-row inline">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="remember"
                checked={loginData.remember}
                onChange={handleInputChange}
              />
              Remember me
            </label>
            <Link to="/reg" className="link-muted">Register</Link>
          </div>

          <div className="form-row">
            <button
              type="submit"
              className="btn primary"
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>

        <section className="demo-instructions" aria-label="Demo instructions">
          <strong>Demo</strong>
          <ul>
            <li>Select "Student" to access feedback submission and view results.</li>
            <li>Select "Administrator / Teacher" for form creation and analytics.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Login;
