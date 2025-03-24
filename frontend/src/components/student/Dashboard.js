import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Student Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <div className="dashboard-content">
        <h2>Welcome, Student!</h2>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>My Courses</h3>
            <p>View your enrolled courses</p>
          </div>
          <div className="dashboard-card">
            <h3>Assignments</h3>
            <p>View and submit assignments</p>
          </div>
          <div className="dashboard-card">
            <h3>Progress</h3>
            <p>Track your learning progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 