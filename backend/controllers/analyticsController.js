const { Analytics, Dashboard } = require('../models/Analytics');

exports.logActivity = async (req, res) => {
  try {
    const activityData = { ...req.body, user: req.user.id };
    await Analytics.create(activityData);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackView = async (req, res) => {
  try {
    await Analytics.create({
      user: req.user?.id,
      course: req.body.courseId,
      type: 'view'
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user.id };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const views = await Analytics.countDocuments({ ...query, type: 'view' });
    const enrollments = await Analytics.countDocuments({ ...query, type: 'enrollment' });
    const completions = await Analytics.countDocuments({ ...query, type: 'completion' });
    
    const byCourse = await Analytics.aggregate([
      { $match: { ...query, user: req.user.id } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      analytics: {
        views,
        enrollments,
        completions,
        byCourse
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, courseId } = req.query;
    const query = { course: courseId };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const views = await Analytics.countDocuments({ ...query, type: 'view' });
    const enrollments = await Analytics.countDocuments({ ...query, type: 'enrollment' });
    const completions = await Analytics.countDocuments({ ...query, type: 'completion' });
    
    const dailyStats = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: 1 },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      analytics: {
        views,
        enrollments,
        completions,
        dailyStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne({ user: req.user.id });
    
    if (!dashboard) {
      dashboard = await Dashboard.create({ user: req.user.id });
    }
    
    res.json({ success: true, dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body, $inc: { updatedAt: Date.now() } },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalyticsOverview = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const totalUsers = await Analytics.distinct('user').then(users => users.length);
    const totalViews = await Analytics.countDocuments({ type: 'view' });
    const totalEnrollments = await Analytics.countDocuments({ type: 'enrollment' });
    const totalCompletions = await Analytics.countDocuments({ type: 'completion' });
    
    const topCourses = await Analytics.aggregate([
      { $group: { _id: '$course', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      overview: {
        totalUsers,
        totalViews,
        totalEnrollments,
        totalCompletions,
        topCourses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};