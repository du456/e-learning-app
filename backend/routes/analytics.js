const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.post('/track', protect, analyticsController.trackView);
router.get('/dashboard', protect, analyticsController.getDashboard);
router.put('/dashboard', protect, analyticsController.updateDashboard);
router.get('/user', protect, analyticsController.getUserAnalytics);
router.get('/course/:courseId', analyticsController.getCourseAnalytics);
router.get('/overview', protect, authorize('admin'), analyticsController.getAnalyticsOverview);

module.exports = router;