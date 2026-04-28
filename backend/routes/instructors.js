const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/auth');

router.post('/become', protect, instructorController.becomeInstructor);
router.get('/pending', protect, authorize('admin'), instructorController.getPendingInstructors);
router.get('/instructors', instructorController.getInstructors);
router.get('/profile/:userId', instructorController.getInstructorProfile);
router.put('/profile', protect, instructorController.updateInstructorProfile);
router.post('/approve/:id', protect, authorize('admin'), instructorController.approveInstructor);
router.post('/qualifications', protect, instructorController.addQualification);
router.post('/experience', protect, instructorController.addExperience);

module.exports = router;