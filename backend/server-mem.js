const express = require('express');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 内存数据库
const db = require('./config/memory-db');
db.init();

// 挂载到全局供路由使用
global.db = db;

// 路由
app.use('/api/auth', require('./routes/auth-mem'));
app.use('/api/questions', require('./routes/questions-mem'));
app.use('/api/exams', require('./routes/exams-mem'));
app.use('/api/user', require('./routes/user-mem'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: 'memory-db',
    questions: db.questions.find().length,
    users: db.users.find().length,
    time: new Date().toISOString()
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '机器人等级考试刷题系统 API',
    version: '1.0.0',
    mode: 'memory-db',
    stats: {
      questions: db.questions.find().length,
      users: db.users.find().length,
      exams: db.exams.find().length
    },
    endpoints: [
      '/api/auth',
      '/api/questions',
      '/api/exams',
      '/api/user',
      '/api/health'
    ]
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 机器人等级考试刷题系统已启动！');
  console.log(`📡 API地址: http://localhost:${PORT}`);
  console.log(`📚 题目数量: ${db.questions.find().length} 道`);
  console.log('');
  console.log('⚡ 模式: 内存数据库（重启后数据会丢失）');
  console.log('💡 生产环境请使用 MongoDB');
  console.log('');
});
