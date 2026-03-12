const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Question } = require('../models');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/robot_exam';

// 示例题目数据
const sampleQuestions = [
  {
    questionNo: '2024-1-001',
    content: '机器人结构中，起着支撑作用的部件是？',
    type: 'single',
    options: [
      { key: 'A', content: '机座' },
      { key: 'B', content: '电机' },
      { key: 'C', content: '腰部' },
      { key: 'D', content: '手臂' }
    ],
    answer: 'A',
    explanation: '机座是机器人的基础部件，起到支撑整个机器人的作用。',
    level: 1,
    year: 2024,
    tags: ['基础结构', '机器人组成'],
    difficulty: 'easy'
  },
  {
    questionNo: '2024-1-002',
    content: '下列没有运用三角形稳定性的是？',
    type: 'single',
    options: [
      { key: 'A', content: '自行车车架' },
      { key: 'B', content: '伸缩门' },
      { key: 'C', content: '屋顶桁架' },
      { key: 'D', content: '起重机吊臂' }
    ],
    answer: 'B',
    explanation: '伸缩门使用的是平行四边形结构，利用的是不稳定性。',
    level: 1,
    year: 2024,
    tags: ['机械结构', '三角形稳定性'],
    difficulty: 'easy'
  },
  {
    questionNo: '2024-1-003',
    content: '关于吹风扇能降低身体表面温度，错误的是？',
    type: 'single',
    options: [
      { key: 'A', content: '风扇一定吹出的是冷风' },
      { key: 'B', content: '风扇能加快人体表面气流的速度' },
      { key: 'C', content: '实际上是通过汗液的蒸发带走人体热量降温' },
      { key: 'D', content: '空气流动加快散热' }
    ],
    answer: 'A',
    explanation: '风扇只是加快空气流动，不一定吹出冷风。降温原理是加速汗液蒸发散热。',
    level: 1,
    year: 2024,
    tags: ['物理常识', '热学'],
    difficulty: 'medium'
  },
  {
    questionNo: '2024-2-001',
    content: '六足机器人中装有分别控制机器人两边的电机，当左侧电机向前速度为150，右侧电机向前速度为250时，六足机器人会？',
    type: 'single',
    options: [
      { key: 'A', content: '向右转' },
      { key: 'B', content: '向左转，并且是一边前行一边左转' },
      { key: 'C', content: '以左边中间的足部为圆心向左转' },
      { key: 'D', content: '以左边靠前的足部为圆心向左转' }
    ],
    answer: 'B',
    explanation: '差速转向原理：右侧速度大于左侧，机器人会向速度较慢的左侧转弯，同时前进。',
    level: 2,
    year: 2024,
    tags: ['运动控制', '差速转向'],
    difficulty: 'medium'
  }
];

async function init() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 清空现有数据
    await Question.deleteMany({});
    console.log('🗑️ 已清空题目数据');

    // 插入示例题目
    await Question.insertMany(sampleQuestions);
    console.log(`✅ 已插入 ${sampleQuestions.length} 道示例题目`);

    // 创建默认管理员
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        nickname: '管理员'
      });
      await admin.save();
      console.log('✅ 已创建默认管理员账号: admin / admin123');
    }

    console.log('\n🎉 数据库初始化完成！');
    console.log('📊 当前题目总数:', await Question.countDocuments());
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

init();
