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
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [_failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  // Simple client-side arithmetic captcha
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  // Demo credentials (replace with real auth in production)
  const STUDENT_PASSWORD = 'vardhan';
  const TEACHER_PASSWORD = 'Faculty';
  useEffect(() => {
    // Clear error when username changes
    if (error && loginData.username.trim().length > 1) setError('');
  }, [loginData.username, error]);

  // generate initial captcha on mount
  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If user is already logged in, redirect to appropriate dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  // Captcha helpers
  const generateCaptcha = (len = 5) => {
    // generate a numeric captcha code (e.g. '26924')
    const chars = '0123456789';
    let code = '';
    for (let i = 0; i < len; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaQuestion(code);
    setCaptchaAnswer(code);
    setCaptchaInput('');
    setCaptchaError('');
  };

  const handleCaptchaChange = (e) => {
    setCaptchaInput(e.target.value);
    if (captchaError) setCaptchaError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // clear field-specific errors while user edits
    if (name === 'username' && error) setError('');
    if (name === 'password' && passwordError) setPasswordError('');
  };

  // Track failed attempts and enforce a short client-side lockout after repeated failures
  const recordFailedAttempt = () => {
    setFailedAttempts(prev => {
      const next = prev + 1;
      if (next >= 5) {
        // Lock for 30 seconds
        setLockUntil(Date.now() + 30_000);
      }
      return next;
    });
  };


  const validate = () => {
    if (!loginData.username || loginData.username.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return false;
    }
    if (!loginData.password || loginData.password.length < 6) {
      setPasswordError('Please enter a password (at least 6 characters).');
      return false;
    }
    // captcha validation
    if (captchaAnswer !== null) {
      if (!captchaInput || String(captchaInput).trim() === '') {
        setCaptchaError('Enter the captcha');
        return false;
      }
        if (String(captchaInput).trim() !== String(captchaAnswer)) {
        setCaptchaError('Incorrect captcha answer');
        return false;
      }
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (lockUntil && Date.now() < lockUntil) {
      const seconds = Math.ceil((lockUntil - Date.now()) / 1000);
      setError(`Too many attempts. Try again in ${seconds} second${seconds > 1 ? 's' : ''}.`);
      return;
    }

    if (!validate()) {
      recordFailedAttempt();
      return;
    }

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

      // Simple credential check for demo purposes
      const provided = loginData.password;
      if (loginData.role === 'student' && provided !== STUDENT_PASSWORD) {
        recordFailedAttempt();
        setPasswordError('Wrong password');
        setLoading(false);
        return;
      }
      if (loginData.role === 'admin' && provided !== TEACHER_PASSWORD) {
        recordFailedAttempt();
        setPasswordError('Wrong password');
        setLoading(false);
        return;
      }

      // Reset password in state immediately after using it transiently.
      setLoginData(prev => ({ ...prev, password: '' }));

      // setUser keeps only non-secret user info.
      setUser(newUser);

      // Show a simple role-based alert to confirm sign-in
      try {
        const roleLabel = newUser.role === 'admin' ? 'Teacher' : 'Student';
        // Show a concise success message
        window.alert(`${roleLabel} login successful`);
      } catch (e) {
        // ignore alert failures in strict environments but log for debugging
        // console.debug is low-noise for dev use
        console.debug(e);
      }

      if (loginData.remember) {
        try {
          localStorage.setItem('kluerp_user', JSON.stringify(newUser));
        } catch {
          // ignore storage failures in restricted environments
        }
      }

      // reset failed attempts on success
      setFailedAttempts(0);
      setLockUntil(0);
    } catch (e) {
      // On error treat as a failed attempt
      // log and record the failure
      console.error(e);
      recordFailedAttempt();
      setError('Sign-in failed. Please try again.');
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
              aria-describedby="username-error"
              autoComplete="name"
            />
            
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
              {passwordError && (
                <div className="field-error" role="alert">{passwordError}</div>
              )}
          
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

           <div className="form-row captcha-row">
             <label htmlFor="captcha">Enter Captcha</label>
             <div className="captcha-box" role="img" aria-label={`Captcha code ${captchaQuestion}`} onClick={() => generateCaptcha()} title="Click to refresh">
               {String(captchaQuestion).split('').map((ch, idx) => (
                 <span key={idx} className="captcha-char">{ch}</span>
               ))}
             </div>

             <div className="captcha-input-row">
               <input
                 id="captcha"
                 name="captcha"
                 type="text"
                 value={captchaInput}
                 onChange={handleCaptchaChange}
                 placeholder="Enter captcha text"
                 aria-describedby="captcha-error"
                 inputMode="numeric"
                 className="captcha-text-input"
               />
               <button type="button" className="captcha-refresh" onClick={() => generateCaptcha()} aria-label="Refresh captcha">↻</button>
             </div>

             {captchaError && <div id="captcha-error" className="field-error" role="alert">{captchaError}</div>}
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
