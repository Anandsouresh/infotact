import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/Dashboard';
import StudentDashboard from './components/student/Dashboard';
import Unauthorized from './components/common/Unauthorized';
import PrivateRoute from './components/auth/PrivateRoute';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute allowedRoles={['student', 'admin']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Redirect authenticated users to their dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {localStorage.getItem('userRole') === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student" replace />
                )}
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 