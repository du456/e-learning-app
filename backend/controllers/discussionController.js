const Discussion = require('../models/Discussion');

exports.createDiscussion = async (req, res) => {
  try {
    const discussionData = { ...req.body, user: req.user.id };
    const discussion = await Discussion.create(discussionData);
    
    const populated = await Discussion.findById(discussion._id)
      .populate('user', 'name avatar')
      .populate('course', 'title');
    
    res.status(201).json({ success: true, discussion: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const { course, search, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (course) query.course = course;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const discussions = await Discussion.find(query)
      .populate('user', 'name avatar')
      .populate('course', 'title')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort('-isPinned -createdAt');
    
    const total = await Discussion.countDocuments(query);
    
    res.json({
      success: true,
      discussions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('user', 'name avatar')
      .populate('course', 'title')
      .populate('comments.user', 'name avatar');
    
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }
    
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDiscussion = async (req, res) => {
  try {
    let discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }
    
    if (discussion.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar');
    
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }
    
    if (discussion.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await discussion.deleteOne();
    
    res.json({ success: true, message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }
    
    discussion.comments.push({
      user: req.user.id,
      content: req.body.content
    });
    await discussion.save();
    
    const updated = await Discussion.findById(req.params.id)
      .populate('comments.user', 'name avatar');
    
    res.json({ success: true, comments: updated.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }
    
    const comment = discussion.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    comment.replies = comment.replies || [];
    comment.replies.push({
      user: req.user.id,
      content: req.body.content
    });
    await discussion.save();
    
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.pinDiscussion = async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $set: { isPinned: req.body.isPinned } },
      { new: true }
    );
    
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resolveDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $set: { isResolved: true } },
      { new: true }
    );
    
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};