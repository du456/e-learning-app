require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const discussionRoutes = require('./routes/discussions');
const assessmentRoutes = require('./routes/assessments');
const instructorRoutes = require('./routes/instructors');
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check (USE THIS INSTEAD OF "/")
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'E-Learning API is running'
  });
});

// Optional base API route (fixes "Cannot GET /api")
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API base route working'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5029;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;