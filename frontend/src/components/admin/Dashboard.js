import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('menu');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
    if (currentView === 'students') {
      fetchStudents();
    }
  }, [currentView]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching students');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleManageCourse = () => {
    navigate('/admin/courses');
  };

  const renderMenu = () => (
    <div className="dashboard-grid">
      <div className="dashboard-card" onClick={handleManageCourse}>
        <h3>Manage Courses</h3>
        <p>Add, edit, and remove courses</p>
      </div>
      <div className="dashboard-card" onClick={() => setCurrentView('students')}>
        <h3>Manage Users</h3>
        <p>View and manage user accounts</p>
      </div>
      <div className="dashboard-card">
        <h3>Analytics</h3>
        <p>View system analytics and reports</p>
      </div>
    </div>
  );

  const renderStudents = () => (
    <>
      <div className="dashboard-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => setCurrentView('menu')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu
          </button>
          <h2>Manage Users</h2>
        </div>
        <div className="total-students">
          <span className="total-students-icon">👥</span>
          Total Students: {students.length}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email ID</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.role}</td>
                  <td>{student.email}</td>
                  <td>{formatDate(student.createdAt)}</td>
                  <td>
                    <button className="view-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <span className="nav-logo">
            <span role="img" aria-label="logo">📚</span>
            InfoTact
          </span>
          <span className="nav-title">Admin Dashboard</span>
        </div>
        <div className="nav-right">
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                {user.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn">
            <svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {currentView === 'menu' ? renderMenu() : renderStudents()}
      </div>
    </div>
  );
};

export default AdminDashboard; 