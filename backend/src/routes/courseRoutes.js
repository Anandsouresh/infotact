const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updateProgress,
  addReview,
  getEnrolledCourses
} = require('../controllers/courseController');

// Public routes
router.get('/', getCourses);

// Protected routes (require authentication)
router.use(auth);

// Student routes
router.get('/enrolled/me', getEnrolledCourses);

// Course-specific routes
router.get('/:id', getCourse);
router.post('/:id/enroll', enrollCourse);
router.put('/:id/progress', updateProgress);
router.post('/:id/review', addReview);

// Admin only routes
router.post('/', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
}, createCourse);

router.put('/:id', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
}, updateCourse);

router.delete('/:id', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
}, deleteCourse);

module.exports = router; 