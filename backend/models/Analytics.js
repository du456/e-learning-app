const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  type: {
    type: String,
    enum: ['view', 'enrollment', 'completion', 'assessment', 'discussion'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ user: 1, createdAt: -1 });
analyticsSchema.index({ course: 1, createdAt: -1 });

const dashboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  monthlyData: [{
    month: String,
    views: Number,
    enrollments: Number,
    revenue: Number
  }],
  courseAnalytics: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    views: Number,
    enrollments: Number,
    completions: Number,
    averageRating: Number
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  Analytics: mongoose.model('Analytics', analyticsSchema),
  Dashboard: mongoose.model('Dashboard', dashboardSchema)
};