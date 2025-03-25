import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CourseManagement.css';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching courses');
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    navigate('/admin/course/new');
  };

  const handleEditCourse = (courseId) => {
    navigate(`/admin/course/edit/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCourses(); // Refresh the courses list
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting course');
      }
    }
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

  return (
    <div className="course-management">
      <div className="course-header">
        <div className="header-left">
          <h2>Course Management</h2>
          <p>Manage your courses and content</p>
        </div>
        <button className="create-course-btn" onClick={handleCreateCourse}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Course
        </button>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <div className="course-image">
              <img src={course.thumbnail} alt={course.title} />
              <div className="course-status">{course.status}</div>
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
              <div className="course-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEditCourse(course._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Course
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteCourse(course._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement; 