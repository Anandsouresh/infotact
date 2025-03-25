const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      duration,
      level,
      price,
      category,
      topics,
      tags,
      modules
    } = req.body;

    // Get the admin user as instructor
    const instructor = await User.findById(req.user.id);
    if (!instructor || instructor.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create courses' });
    }

    // Create the course
    const course = await Course.create({
      title,
      description,
      thumbnail,
      duration,
      level,
      price,
      category,
      topics,
      tags,
      modules,
      instructor: instructor._id
    });

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents.student', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .populate('instructor', 'name email')
      .select('-modules.videoUrl');
    
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this course' });
    }

    await course.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if student is already enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.user._id.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({ success: false, error: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push({
      student: req.user._id,
      enrollmentDate: Date.now(),
      progress: 0,
      completedModules: []
    });

    await course.save();
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update course progress
exports.updateProgress = async (req, res) => {
  try {
    const { moduleIndex, completed } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === req.user._id.toString()
    );

    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Not enrolled in this course' });
    }

    if (completed && !enrollment.completedModules.includes(moduleIndex)) {
      enrollment.completedModules.push(moduleIndex);
    } else if (!completed) {
      enrollment.completedModules = enrollment.completedModules.filter(m => m !== moduleIndex);
    }

    // Calculate progress
    enrollment.progress = (enrollment.completedModules.length / course.modules.length) * 100;

    await course.save();
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add review to course
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Check if user is enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({ success: false, error: 'Must be enrolled to review the course' });
    }

    // Check if user has already reviewed
    const hasReviewed = course.reviews.some(
      review => review.student.toString() === req.user._id.toString()
    );

    if (hasReviewed) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this course' });
    }

    course.reviews.push({
      student: req.user._id,
      rating,
      comment,
      date: Date.now()
    });

    course.calculateAverageRating();
    await course.save();

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get enrolled courses for a student
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      'enrolledStudents.student': req.user._id
    })
    .populate('instructor', 'name email')
    .select('-modules.videoUrl');

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}; 