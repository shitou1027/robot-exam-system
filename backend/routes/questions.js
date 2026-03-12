const express = require('express');
const router = express.Router();
const { Question } = require('../models');

// 获取题目列表
router.get('/', async (req, res) => {
  try {
    const { level, year, type, difficulty, tag, page = 1, limit = 20 } = req.query;
    
    const query = { status: 'active' };
    if (level) query.level = parseInt(level);
    if (year) query.year = parseInt(year);
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = { $in: [tag] };
    
    const questions = await Question.find(query)
      .select('-answer -explanation') // 不返回答案
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ year: -1, questionNo: 1 });
    
    const total = await Question.countDocuments(query);
    
    res.json({
      success: true,
      data: questions,
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

// 获取随机题目（用于组卷）
router.get('/random', async (req, res) => {
  try {
    const { level, count = 30 } = req.query;
    
    const query = { status: 'active' };
    if (level) query.level = parseInt(level);
    
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } },
      { $project: { answer: 0, explanation: 0 } }
    ]);
    
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取题目详情
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: '题目不存在' });
    }
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 批量添加题目（管理员用）
router.post('/batch', async (req, res) => {
  try {
    const { questions } = req.body;
    const result = await Question.insertMany(questions, { ordered: false });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加单题
router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取筛选选项（年份、等级等）
router.get('/filters/options', async (req, res) => {
  try {
    const levels = await Question.distinct('level');
    const years = await Question.distinct('year');
    const tags = await Question.distinct('tags');
    
    res.json({
      success: true,
      data: {
        levels: levels.sort((a, b) => a - b),
        years: years.sort((a, b) => b - a),
        tags: tags.filter(t => t)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
