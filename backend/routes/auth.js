const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 微信小程序登录
router.post('/wechat-login', async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    
    // 这里应该调用微信接口换取openid
    // 简化处理，直接创建/更新用户
    let user = await User.findOne({ openid: code });
    
    if (!user) {
      user = new User({
        openid: code,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl || '',
        role: 'user'
      });
      await user.save();
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
          role: user.role,
          stats: user.stats
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 管理员登录
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username, role: 'admin' });
    if (!user) {
      return res.status(401).json({ success: false, error: '账号或密码错误' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: '账号或密码错误' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建管理员账号（首次启动用）
router.post('/setup-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 检查是否已存在管理员
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: '管理员已存在' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      username,
      password: hashedPassword,
      role: 'admin',
      nickname: '管理员'
    });
    
    await admin.save();
    
    res.json({ success: true, message: '管理员创建成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
