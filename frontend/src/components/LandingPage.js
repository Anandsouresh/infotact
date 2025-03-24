import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to InfoTact</h1>
        <p>Your Learning Management System</p>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn login-btn">
            Login
          </Link>
          <Link to="/register" className="landing-btn register-btn">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 