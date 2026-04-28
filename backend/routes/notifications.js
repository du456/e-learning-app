const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, notificationController.getNotifications);
router.post('/read/:id', protect, notificationController.markAsRead);
router.post('/read-all', protect, notificationController.markAllAsRead);
router.delete('/:id', protect, notificationController.deleteNotification);
router.post('/bulk', protect, authorize('admin'), notificationController.sendBulkNotifications);

module.exports = router;