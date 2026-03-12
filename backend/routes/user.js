const express = require('express');
const router = express.Router();
const { User } = require('../models');

// 获取用户信息
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -openid')
      .populate('favorites', 'content type level');
    
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新学习统计
router.post('/:userId/stats', async (req, res) => {
  try {
    const { correct, total } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    user.stats.totalQuestions += total;
    user.stats.correctQuestions += correct;
    
    // 更新连续学习天数
    const today = new Date().toDateString();
    const lastDate = user.stats.lastStudyDate?.toDateString();
    
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
    
    await user.save();
    
    res.json({ success: true, data: user.stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 收藏题目
router.post('/:userId/favorite', async (req, res) => {
  try {
    const { questionId } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    const index = user.favorites.indexOf(questionId);
    if (index === -1) {
      user.favorites.push(questionId);
    } else {
      user.favorites.splice(index, 1);
    }
    
    await user.save();
    
    res.json({ success: true, isFavorited: index === -1 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加到错题本
router.post('/:userId/wrong', async (req, res) => {
  try {
    const { questionId } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    const existing = user.wrongQuestions.find(
      w => w.question.toString() === questionId
    );
    
    if (existing) {
      existing.count += 1;
      existing.lastWrongAt = new Date();
    } else {
      user.wrongQuestions.push({ question: questionId });
    }
    
    await user.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取错题本
router.get('/:userId/wrongs', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('wrongQuestions.question');
    
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    
    res.json({
      success: true,
      data: user.wrongQuestions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
