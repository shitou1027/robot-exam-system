const express = require('express');
const router = express.Router();

// 开始考试
router.post('/start', (req, res) => {
  try {
    const { userId, level, type = 'mock', config = {} } = req.body;
    
    // 随机选题
    const questionCount = config.questionCount || 30;
    let questions = global.db.questions.find({ 
      level: parseInt(level), 
      status: 'active' 
    });
    
    questions = questions
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount)
      .map(q => ({ ...q, answer: undefined, explanation: undefined }));
    
    // 创建考试记录
    const exam = global.db.exams.create({
      user: userId,
      type,
      level: parseInt(level),
      config: {
        questionCount,
        timeLimit: config.timeLimit || 60
      },
      questions: questions.map(q => ({ question: q._id })),
      status: 'ongoing',
      startTime: new Date()
    });
    
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
router.post('/:examId/answer', (req, res) => {
  try {
    const { questionId, answer, timeSpent = 0 } = req.body;
    
    const exam = global.db.exams.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ success: false, error: '考试不存在' });
    }
    
    const question = global.db.questions.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, error: '题目不存在' });
    }
    
    const qIndex = exam.questions.findIndex(q => q.question === questionId);
    if (qIndex !== -1) {
      exam.questions[qIndex] = {
        ...exam.questions[qIndex],
        userAnswer: answer,
        isCorrect: answer === question.answer,
        timeSpent
      };
      global.db.exams.save(exam);
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
router.post('/:examId/submit', (req, res) => {
  try {
    let exam = global.db.exams.findById(req.params.examId);
    
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
    
    exam = global.db.exams.save({
      ...exam,
      score: { total, correct, wrong, unanswered, percentage },
      status: 'completed',
      endTime: new Date(),
      duration: Math.floor((new Date() - new Date(exam.startTime)) / 1000)
    });
    
    // 填充题目详情
    const questionsWithDetails = exam.questions.map(q => {
      const question = global.db.questions.findById(q.question);
      return {
        question,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect
      };
    });
    
    res.json({
      success: true,
      data: {
        examId: exam._id,
        score: exam.score,
        duration: exam.duration,
        questions: questionsWithDetails
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取考试历史
router.get('/history/:userId', (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    let exams = global.db.exams.find({ user: req.params.userId })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const total = exams.length;
    exams = exams.slice((page - 1) * limit, page * limit);
    
    // 移除题目详情，只保留基本信息
    const safeExams = exams.map(e => ({
      ...e,
      questions: undefined
    }));
    
    res.json({
      success: true,
      data: safeExams,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
