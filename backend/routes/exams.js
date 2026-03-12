const express = require('express');
const router = express.Router();
const { Exam, Question } = require('../models');

// 开始考试
router.post('/start', async (req, res) => {
  try {
    const { userId, level, type = 'mock', config = {} } = req.body;
    
    // 随机选题
    const questionCount = config.questionCount || 30;
    const questions = await Question.aggregate([
      { $match: { level: parseInt(level), status: 'active' } },
      { $sample: { size: questionCount } },
      { $project: { answer: 0, explanation: 0 } }
    ]);
    
    // 创建考试记录
    const exam = new Exam({
      user: userId,
      type,
      level: parseInt(level),
      config: {
        questionCount,
        timeLimit: config.timeLimit || 60,
        ...config
      },
      questions: questions.map(q => ({ question: q._id }))
    });
    
    await exam.save();
    
    res.json({
      success: true,
      data: {
        examId: exam._id,
        questions,
        config: exam.config,
        startTime: exam.startTime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 提交答案
router.post('/:examId/answer', async (req, res) => {
  try {
    const { questionId, answer, timeSpent = 0 } = req.body;
    
    const exam = await Exam.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ success: false, error: '考试不存在' });
    }
    
    // 查找题目
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, error: '题目不存在' });
    }
    
    // 更新答题记录
    const questionIndex = exam.questions.findIndex(
      q => q.question.toString() === questionId
    );
    
    if (questionIndex !== -1) {
      exam.questions[questionIndex].userAnswer = answer;
      exam.questions[questionIndex].isCorrect = answer === question.answer;
      exam.questions[questionIndex].timeSpent = timeSpent;
      await exam.save();
    }
    
    res.json({
      success: true,
      data: {
        isCorrect: answer === question.answer,
        correctAnswer: question.answer,
        explanation: question.explanation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 提交考试
router.post('/:examId/submit', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId)
      .populate('questions.question');
    
    if (!exam) {
      return res.status(404).json({ success: false, error: '考试不存在' });
    }
    
    // 计算成绩
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    
    exam.questions.forEach(q => {
      if (!q.userAnswer) {
        unanswered++;
      } else if (q.isCorrect) {
        correct++;
      } else {
        wrong++;
      }
    });
    
    const total = exam.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    exam.score = { total, correct, wrong, unanswered, percentage };
    exam.status = 'completed';
    exam.endTime = new Date();
    exam.duration = Math.floor((exam.endTime - exam.startTime) / 1000);
    
    await exam.save();
    
    res.json({
      success: true,
      data: {
        examId: exam._id,
        score: exam.score,
        duration: exam.duration,
        questions: exam.questions.map(q => ({
          question: q.question,
          userAnswer: q.userAnswer,
          isCorrect: q.isCorrect,
          correctAnswer: q.question.answer
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取考试历史
router.get('/history/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const exams = await Exam.find({ user: req.params.userId })
      .select('-questions')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Exam.countDocuments({ user: req.params.userId });
    
    res.json({
      success: true,
      data: exams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
