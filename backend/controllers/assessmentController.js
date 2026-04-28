const Assessment = require('../models/Assessment');
const Course = require('../models/Course');
const User = require('../models/User');

exports.createAssessment = async (req, res) => {
  try {
    req.body.course = req.params.courseId || req.body.course;
    const assessment = await Assessment.create(req.body);
    
    res.status(201).json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const { course, type } = req.query;
    const query = {};
    
    if (course) query.course = course;
    if (type) query.type = type;
    
    const assessments = await Assessment.find(query)
      .populate('course', 'title')
      .select('-questions.correctAnswer')
      .sort('-createdAt');
    
    res.json({ success: true, assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('course', 'title');
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    
    res.json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    
    let score = 0;
    let totalPoints = 0;
    const answers = req.body.answers || [];
    
    const evaluatedAnswers = answers.map(answer => {
      const question = assessment.questions.id(answer.questionId);
      if (!question) return null;
      
      totalPoints += question.points;
      const isCorrect = question.correctAnswer === answer.answer;
      if (isCorrect) score += question.points;
      
      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    }).filter(a => a !== null);
    
    const percentageScore = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentageScore >= assessment.passingScore;
    
    const Submission = require('../models/Assessment');
    const submission = await Submission.create({
      user: req.user.id,
      assessment: assessment._id,
      answers: evaluatedAnswers,
      score,
      totalPoints,
      passed
    });
    
    res.status(201).json({
      success: true,
      submission: {
        ...submission.toObject(),
        percentageScore,
        passed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const Submission = require('../models/Assessment');
    const submissions = await Submission.find({ user: req.user.id })
      .populate({
        path: 'assessment',
        populate: { path: 'course', select: 'title' }
      })
      .sort('-submittedAt');
    
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubmission = async (req, res) => {
  try {
    const Submission = require('../models/Assessment');
    const submission = await Submission.findById(req.params.submissionId)
      .populate({
        path: 'assessment',
        populate: { path: 'course', select: 'title' }
      });
    
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    if (submission.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ course: req.params.courseId })
      .select('-questions.correctAnswer')
      .sort('order');
    
    res.json({ success: true, assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};