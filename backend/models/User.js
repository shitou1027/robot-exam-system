const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 微信openid
  openid: { type: String, unique: true, sparse: true },
  
  // 用户信息
  nickname: { type: String, default: '' },
  avatar: { type: String, default: '' },
  
  // 账号密码（管理后台用）
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  
  // 角色：user-普通用户, admin-管理员
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // 学习统计
  stats: {
    totalExams: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctQuestions: { type: Number, default: 0 },
    streak: { type: Number, default: 0 }, // 连续打卡天数
    lastStudyDate: { type: Date }
  },
  
  // 收藏的试题
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  
  // 错题本
  wrongQuestions: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    count: { type: Number, default: 1 },
    lastWrongAt: { type: Date, default: Date.now }
  }],
  
  // 当前学习的等级
  currentLevel: { type: Number, default: 1 },
  
  // 状态
  status: { type: String, enum: ['active', 'banned'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
