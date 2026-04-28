const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('instructor', 'admin'), assessmentController.createAssessment);
router.get('/', assessmentController.getAssessments);
router.get('/my-submissions', protect, assessmentController.getMySubmissions);
router.get('/course/:courseId', assessmentController.getCourseAssessments);
router.get('/:id', assessmentController.getAssessment);
router.put('/:id', protect, authorize('instructor', 'admin'), assessmentController.updateAssessment);
router.delete('/:id', protect, authorize('instructor', 'admin'), assessmentController.deleteAssessment);
router.post('/:id/submit', protect, assessmentController.submitAssessment);
router.get('/submission/:submissionId', protect, assessmentController.getSubmission);

module.exports = router;