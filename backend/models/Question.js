const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // 题目编号
  questionNo: { type: String, required: true, unique: true },
  
  // 题目内容
  content: { type: String, required: true },
  
  // 题目类型：single-单选, multiple-多选, judge-判断
  type: { type: String, enum: ['single', 'multiple', 'judge'], required: true },
  
  // 选项
  options: [{
    key: String,      // A, B, C, D
    content: String   // 选项内容
  }],
  
  // 正确答案
  answer: { type: String, required: true },
  
  // 答案解析
  explanation: { type: String, default: '' },
  
  // 所属等级：1-8级
  level: { type: Number, min: 1, max: 8, required: true },
  
  // 考试年份
  year: { type: Number, required: true },
  
  // 考试月份
  month: { type: Number, min: 1, max: 12 },
  
  // 题型分类：theory-理论, practical-实操
  category: { type: String, enum: ['theory', 'practical'], default: 'theory' },
  
  // 知识点标签
  tags: [{ type: String }],
  
  // 难度：easy-简单, medium-中等, hard-困难
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  
  // 来源
  source: { type: String, default: '' },
  
  // 状态
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  
  // 使用统计
  stats: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// 索引
questionSchema.index({ level: 1, year: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ type: 1 });

module.exports = mongoose.model('Question', questionSchema);
