const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, discussionController.createDiscussion);
router.get('/', discussionController.getDiscussions);
router.get('/:id', discussionController.getDiscussion);
router.put('/:id', protect, discussionController.updateDiscussion);
router.delete('/:id', protect, discussionController.deleteDiscussion);

router.post('/:id/comments', protect, discussionController.addComment);
router.post('/:id/comments/:commentId/reply', protect, discussionController.addReply);
router.post('/:id/pin', protect, discussionController.pinDiscussion);
router.post('/:id/resolve', protect, discussionController.resolveDiscussion);

module.exports = router;