import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';

const Navigation = () => {
  const { user, setUser } = useFeedback();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
  };

  const isActive = (path) => location.pathname === path;

  if (!user) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            Student Feedback System
          </Link>
          <div className="nav-links">
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Student Feedback System
        </Link>
        
        <div className="nav-links">
          {user.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/admin/forms" className={`nav-link ${isActive('/admin/forms') ? 'active' : ''}`}>
                Manage Forms
              </Link>
              <Link to="/admin/analytics" className={`nav-link ${isActive('/admin/analytics') ? 'active' : ''}`}>
                Analytics
              </Link>
              <Link to="/admin/courses" className={`nav-link ${isActive('/admin/courses') ? 'active' : ''}`}>
                Courses
              </Link>
            </>
          )}
          
          {user.role === 'student' && (
            <>
              <Link to="/student" className={`nav-link ${isActive('/student') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/student/feedback" className={`nav-link ${isActive('/student/feedback') ? 'active' : ''}`}>
                Give Feedback
              </Link>
              <Link to="/student/results" className={`nav-link ${isActive('/student/results') ? 'active' : ''}`}>
                View Results
              </Link>
            </>
          )}
          
          <div className="nav-user">
            <span className="user-name">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;