const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  // 用户
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // 考试类型：mock-模拟考试, practice-练习, wrong-错题重做
  type: { type: String, enum: ['mock', 'practice', 'wrong'], required: true },
  
  // 等级
  level: { type: Number, required: true },
  
  // 考试配置
  config: {
    questionCount: { type: Number, default: 30 },
    timeLimit: { type: Number, default: 60 }, // 分钟
    categories: [{ type: String }] // 题型筛选
  },
  
  // 试题列表
  questions: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: { type: String, default: '' },
    isCorrect: { type: Boolean, default: false },
    timeSpent: { type: Number, default: 0 } // 秒
  }],
  
  // 成绩
  score: {
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    unanswered: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  },
  
  // 时间记录
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // 实际用时（秒）
  
  // 状态
  status: { type: String, enum: ['ongoing', 'completed', 'abandoned'], default: 'ongoing' }
}, {
  timestamps: true
});

// 索引
examSchema.index({ user: 1, createdAt: -1 });
examSchema.index({ level: 1 });

module.exports = mongoose.model('Exam', examSchema);
