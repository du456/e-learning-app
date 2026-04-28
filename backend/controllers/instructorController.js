const User = require('../models/User');
const InstructorProfile = require('../models/InstructorProfile');

exports.becomeInstructor = async (req, res) => {
  try {
    const existingProfile = await InstructorProfile.findOne({ user: req.user.id });
    
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Already an instructor' });
    }
    
    if (req.user.role === 'instructor') {
      return res.status(400).json({ success: false, message: 'Already an instructor' });
    }
    
    const instructorProfile = await InstructorProfile.create({
      user: req.user.id,
      ...req.body
    });
    
    res.status(201).json({ success: true, instructorProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveInstructor = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const profile = await InstructorProfile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }
    
    profile.isApproved = true;
    profile.approvedAt = Date.now();
    await profile.save();
    
    await User.findByIdAndUpdate(profile.user, { role: 'instructor' });
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInstructorProfile = async (req, res) => {
  try {
    const profile = await InstructorProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email avatar bio');
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInstructorProfile = async (req, res) => {
  try {
    const profile = await InstructorProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    const query = { isApproved: true };
    
    const profiles = await InstructorProfile.find(query)
      .populate('user', 'name email avatar bio')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort('-totalStudents');
    
    const total = await InstructorProfile.countDocuments(query);
    
    res.json({
      success: true,
      instructors: profiles,
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

exports.getPendingInstructors = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const profiles = await InstructorProfile.find({ isApproved: false })
      .populate('user', 'name email avatar');
    
    res.json({ success: true, instructors: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addQualification = async (req, res) => {
  try {
    const profile = await InstructorProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    profile.qualifications.push(req.body);
    await profile.save();
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addExperience = async (req, res) => {
  try {
    const profile = await InstructorProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    profile.experience.push(req.body);
    await profile.save();
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInstructorStats = async (userId, updates) => {
  try {
    await InstructorProfile.findOneAndUpdate(
      { user: userId },
      { $inc: updates },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating instructor stats:', error);
  }
};