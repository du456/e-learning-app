const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('instructor', 'admin'), courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/my-courses', protect, courseController.getMyCourses);
router.get('/instructor', protect, courseController.getInstructorCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);
router.post('/:id/enroll', protect, courseController.enrollCourse);

router.post('/:id/lessons', protect, courseController.addLesson);
router.put('/:id/lessons/:lessonId', protect, courseController.updateLesson);
router.delete('/:id/lessons/:lessonId', protect, courseController.deleteLesson);

module.exports = router;