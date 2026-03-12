const express = require('express');
const router = express.Router();

// 获取题目列表
router.get('/', (req, res) => {
  try {
    const { level, year, type, difficulty, tag, page = 1, limit = 20 } = req.query;
    
    const query = { status: 'active' };
    if (level) query.level = parseInt(level);
    if (year) query.year = parseInt(year);
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = { $in: [tag] };
    
    let questions = global.db.questions.find(query, {
      sort: { year: -1 },
      limit: parseInt(limit)
    });
    
    // 不返回答案（用于练习模式）
    const safeQuestions = questions.map(q => ({
      ...q,
      answer: undefined,
      explanation: undefined
    }));
    
    res.json({
      success: true,
      data: safeQuestions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: global.db.questions.countDocuments(query)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取随机题目
router.get('/random', (req, res) => {
  try {
    const { level, count = 30 } = req.query;
    
    const query = { status: 'active' };
    if (level) query.level = parseInt(level);
    
    let questions = global.db.questions.find(query);
    
    // 随机打乱
    questions = questions.sort(() => Math.random() - 0.5).slice(0, parseInt(count));
    
    // 不返回答案
    const safeQuestions = questions.map(q => ({
      ...q,
      answer: undefined,
      explanation: undefined
    }));
    
    res.json({ success: true, data: safeQuestions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取题目详情
router.get('/:id', (req, res) => {
  try {
    const question = global.db.questions.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: '题目不存在' });
    }
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加题目
router.post('/', (req, res) => {
  try {
    const question = global.db.questions.create(req.body);
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 批量添加
router.post('/batch', (req, res) => {
  try {
    const { questions } = req.body;
    const result = global.db.questions.insertMany(questions);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取筛选选项
router.get('/filters/options', (req, res) => {
  try {
    const levels = global.db.questions.distinct('level').sort((a, b) => a - b);
    const years = global.db.questions.distinct('year').sort((a, b) => b - a);
    const tags = global.db.questions.distinct('tags').filter(t => t);
    
    res.json({
      success: true,
      data: { levels, years, tags }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
