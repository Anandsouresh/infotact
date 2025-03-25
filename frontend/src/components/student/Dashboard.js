import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('available'); // 'available', 'enrolled', or 'quiz'
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Fetch all courses
      const coursesResponse = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch enrolled courses
      const enrolledResponse = await axios.get('http://localhost:5000/api/courses/enrolled/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAvailableCourses(coursesResponse.data.data);
      setEnrolledCourses(enrolledResponse.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching courses');
      setLoading(false);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses(); // Refresh both available and enrolled courses
    } catch (error) {
      setError(error.response?.data?.message || 'Error enrolling in course');
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId);
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
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'available':
        return (
          <div className="courses-grid">
            {availableCourses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-image">
                  <img src={course.thumbnail} alt={course.title} />
                  {isEnrolled(course._id) && (
                    <div className="enrolled-badge">Enrolled</div>
                  )}
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span className="course-level">{course.level}</span>
                    <span className="course-duration">{course.duration}</span>
                    <span className="course-price">${course.price}</span>
                  </div>
                  <div className="course-stats">
                    <span>Students: {course.enrolledStudents?.length || 0}</span>
                    <span>Rating: {course.rating || 'No ratings'}</span>
                  </div>
                  {isEnrolled(course._id) ? (
                    <button 
                      className="continue-btn"
                      onClick={() => navigate(`/student/course/${course._id}`)}
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <button 
                      className="enroll-btn"
                      onClick={() => handleEnrollCourse(course._id)}
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'enrolled':
        return (
          <div className="courses-grid">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-image">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="course-progress">
                    Progress: {course.progress}%
                  </div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span className="course-level">{course.level}</span>
                    <span className="course-duration">{course.duration}</span>
                  </div>
                  <button 
                    className="continue-btn"
                    onClick={() => navigate(`/student/course/${course._id}`)}
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'quiz':
        return (
          <div className="quiz-section">
            <h3>Available Quizzes</h3>
            <p>Select a course to view its quizzes</p>
            <div className="courses-grid">
              {enrolledCourses.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-image">
                    <img src={course.thumbnail} alt={course.title} />
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <button 
                      className="continue-btn"
                      onClick={() => navigate(`/student/course/${course._id}/quizzes`)}
                    >
                      View Quizzes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="student-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <span className="nav-logo">
            <span role="img" aria-label="logo">📚</span>
            InfoTact
          </span>
          <span className="nav-title">Student Dashboard</span>
        </div>
        <div className="nav-right">
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                {user.name ? user.name[0].toUpperCase() : 'S'}
              </div>
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-role">Student</div>
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
        <div className="dashboard-menu">
          <button 
            className={`menu-btn ${activeMenu === 'available' ? 'active' : ''}`}
            onClick={() => setActiveMenu('available')}
          >
            <span role="img" aria-label="available">📚</span>
            Available Courses
          </button>
          <button 
            className={`menu-btn ${activeMenu === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveMenu('enrolled')}
          >
            <span role="img" aria-label="enrolled">🎓</span>
            My Courses
          </button>
          <button 
            className={`menu-btn ${activeMenu === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveMenu('quiz')}
          >
            <span role="img" aria-label="quiz">✍️</span>
            Quizzes
          </button>
        </div>

        <div className="dashboard-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 