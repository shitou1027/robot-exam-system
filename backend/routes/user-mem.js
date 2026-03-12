const express = require('express');
const router = express.Router();

// 获取用户信息
router.get('/:userId', (req, res) => {
  try {
    const user = global.db.users.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    // 不返回敏感信息
    const { password, openid, ...safeUser } = user;
    
    res.json({ success: true, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新统计
router.post('/:userId/stats', (req, res) => {
  try {
    const { correct, total } = req.body;
    
    let user = global.db.users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    user.stats.totalQuestions += total;
    user.stats.correctQuestions += correct;
    
    // 连续学习天数
    const today = new Date().toDateString();
    const lastDate = user.stats.lastStudyDate ? new Date(user.stats.lastStudyDate).toDateString() : null;
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString()) {
        user.stats.streak += 1;
      } else {
        user.stats.streak = 1;
      }
      user.stats.lastStudyDate = new Date();
    }
    
    global.db.users.save(user);
    
    res.json({ success: true, data: user.stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 收藏题目
router.post('/:userId/favorite', (req, res) => {
  try {
    const { questionId } = req.body;
    
    let user = global.db.users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    const index = user.favorites.indexOf(questionId);
    if (index === -1) {
      user.favorites.push(questionId);
    } else {
      user.favorites.splice(index, 1);
    }
    
    global.db.users.save(user);
    
    res.json({ success: true, isFavorited: index === -1 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加到错题本
router.post('/:userId/wrong', (req, res) => {
  try {
    const { questionId } = req.body;
    
    let user = global.db.users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    const existing = user.wrongQuestions.find(
      w => w.question === questionId
    );
    
    if (existing) {
      existing.count += 1;
      existing.lastWrongAt = new Date();
    } else {
      user.wrongQuestions.push({ question: questionId, count: 1, lastWrongAt: new Date() });
    }
    
    global.db.users.save(user);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取错题本
router.get('/:userId/wrongs', (req, res) => {
  try {
    const user = global.db.users.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    // 填充题目详情
    const wrongsWithDetails = user.wrongQuestions.map(w => ({
      ...w,
      question: global.db.questions.findById(w.question)
    }));
    
    res.json({ success: true, data: wrongsWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
