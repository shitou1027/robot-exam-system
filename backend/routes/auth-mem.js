const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'your-secret-key';

// 微信小程序登录
router.post('/wechat-login', async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    
    let user = global.db.users.findOne({ openid: code });
    
    if (!user) {
      user = global.db.users.create({
        openid: code,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl || '',
        role: 'user',
        stats: { totalQuestions: 0, correctQuestions: 0, streak: 0, totalExams: 0 },
        favorites: [],
        wrongQuestions: []
      });
    }
    
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    
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
    
    const user = global.db.users.findOne({ username, role: 'admin' });
    if (!user) {
      return res.status(401).json({ success: false, error: '账号或密码错误' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: '账号或密码错误' });
    }
    
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    
    res.json({
      success: true,
      data: { token, user: { id: user._id, username, role: user.role } }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建管理员
router.post('/setup-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingAdmin = global.db.users.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: '管理员已存在' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    global.db.users.create({
      username,
      password: hashedPassword,
      role: 'admin',
      nickname: '管理员'
    });
    
    res.json({ success: true, message: '管理员创建成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 初始化默认管理员
setTimeout(async () => {
  const existingAdmin = global.db.users.findOne({ role: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    global.db.users.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      nickname: '管理员'
    });
    console.log('✅ 已创建默认管理员: admin / admin123');
  }
}, 100);

module.exports = router;
