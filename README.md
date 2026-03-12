# 🤖 机器人等级考试刷题小程序

类似「南瓜派」风格的青少年机器人技术等级考试刷题系统。

## ✅ 已完成功能

### 后端 API (已启动)
- ✅ 题目管理（增删改查）
- ✅ 模拟考试（随机组卷、计时、自动评分）
- ✅ 练习模式（顺序、随机、按年份、按知识点）
- ✅ 用户系统（登录、统计、收藏、错题本）
- ✅ 12道示例题目（1-3级）

### 小程序前端 (框架已搭好)
- ✅ 首页（等级选择、快捷入口、统计展示）
- ✅ 答题页面（单选/多选/判断、答案解析、收藏）
- ✅ 考试页面（倒计时、答题卡、自动提交）
- ✅ 练习页面（按年份、按知识点筛选）
- ✅ 个人中心（学习统计、错题本、收藏）

---

## 🚀 快速启动

### 1. 后端服务（已运行）
```bash
# 服务已在后台运行
curl http://localhost:3000/api/health

# 查看日志
cat /tmp/robot-exam.log

# 重启服务
pkill -f "node server-mem"  # 停止
nohup bash -c 'cd /root/Desktop/robot-exam-system/backend && node server-mem.js' > /tmp/robot-exam.log 2>&1 &  # 启动
```

**API地址**: http://localhost:3000

**默认管理员**: admin / admin123

### 2. 小程序开发

#### 下载微信开发者工具
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

#### 导入项目
1. 打开微信开发者工具
2. 选择「导入项目」
3. 选择 `/root/Desktop/robot-exam-system/miniapp` 目录
4. AppID 选择「测试号」或填写自己的
5. 修改 `miniapp/app.js` 中的 `apiBaseUrl`:
   ```javascript
   apiBaseUrl: 'http://localhost:3000/api'
   ```
   
   ⚠️ 真机调试时需要换成服务器IP或域名

#### 项目结构
```
miniapp/
├── app.js              # 小程序入口
├── app.json            # 全局配置
├── pages/
│   ├── index/          # 首页
│   ├── question/       # 答题页面
│   ├── exam/           # 考试页面
│   ├── practice/       # 练习页面
│   └── profile/        # 个人中心
└── images/             # 图片资源
```

---

## 📚 API 接口文档

### 基础信息
- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`

### 接口列表

#### 题目相关
```
GET  /questions              # 获取题目列表
GET  /questions/random      # 随机选题
GET  /questions/:id         # 题目详情
POST /questions             # 添加题目（管理）
GET  /questions/filters/options  # 获取筛选选项
```

#### 考试相关
```
POST /exams/start           # 开始考试
POST /exams/:id/answer      # 提交答案
POST /exams/:id/submit      # 提交试卷
GET  /exams/history/:userId # 考试历史
```

#### 用户相关
```
POST /auth/wechat-login     # 微信登录
POST /auth/admin-login      # 管理员登录
GET  /user/:id              # 用户信息
POST /user/:id/stats        # 更新统计
POST /user/:id/favorite     # 收藏/取消收藏
POST /user/:id/wrong        # 添加错题
GET  /user/:id/wrongs       # 获取错题本
```

---

## 🗂️ 项目目录

```
robot-exam-system/
├── README.md               # 本文件
├── docker-compose.yml      # Docker部署配置
├── backend/                # 后端服务
│   ├── server-mem.js       # 内存数据库版（当前运行）
│   ├── server.js           # MongoDB版（生产用）
│   ├── package.json
│   ├── models/             # 数据模型
│   ├── routes/             # 路由
│   │   ├── auth-mem.js     # 认证（内存版）
│   │   ├── questions-mem.js
│   │   ├── exams-mem.js
│   │   └── user-mem.js
│   ├── config/
│   │   └── memory-db.js    # 内存数据库
│   └── scripts/
│       └── sample-questions.js  # 示例题目
├── miniapp/                # 小程序前端
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   └── pages/
│       ├── index/
│       ├── question/
│       ├── exam/
│       ├── practice/
│       └── profile/
└── admin/                  # 管理后台（待开发）
```

---

## 📝 添加更多题目

编辑 `backend/scripts/sample-questions.js`，添加更多真题，然后重启服务：

```javascript
module.exports = [
  {
    questionNo: '2024-1-001',     // 题号
    content: '题目内容',           // 题目
    type: 'single',               // 类型：single/multiple/judge
    options: [                    // 选项
      { key: 'A', content: '选项A' },
      { key: 'B', content: '选项B' }
    ],
    answer: 'A',                  // 正确答案
    explanation: '解析',          // 答案解析
    level: 1,                     // 等级 1-8
    year: 2024,                   // 年份
    tags: ['标签1', '标签2'],      // 知识点标签
    difficulty: 'easy',           // 难度：easy/medium/hard
    status: 'active'
  }
  // ... 更多题目
];
```

---

## 🎨 界面参考（南瓜派风格）

### 设计特点
- 绿色主色调（#4CAF50）
- 圆角卡片设计
- 清晰的进度展示
- 答题卡快速跳转
- 流畅的交互动画

### 页面截图示意
```
┌─────────────────────────────┐
│  机器人等级考试              │
│  青少年技术等级考试刷题平台  │
├─────────────────────────────┤
│  选择等级                    │
│  [1级] [2级] [3级] ...      │
├─────────────────────────────┤
│  📚 顺序练习   📝 模拟考试  │
│  ❌ 错题重做   ⭐ 收藏题目  │
├─────────────────────────────┤
│  学习统计                    │
│  已做题  正确率  连续天数   │
└─────────────────────────────┘
```

---

## 🔧 后续开发计划

### 高优先级
- [ ] 导入真实历年真题（2017-2024）
- [ ] 完成小程序页面样式细节
- [ ] 添加答题结果页面
- [ ] 实现真题按年份分类浏览

### 中优先级
- [ ] 管理后台（Web端）
- [ ] 题目批量导入（Excel/JSON）
- [ ] 学习报告和数据分析
- [ ] 排行榜功能

### 低优先级
- [ ] 视频解析
- [ ] 社区讨论
- [ ] 打卡分享

---

## 💡 使用建议

### 开发阶段
1. 使用内存数据库快速迭代
2. 微信小程序开发者工具开启「不校验域名」
3. 使用真机调试测试网络请求

### 生产部署
1. 安装 MongoDB 并迁移数据
2. 配置域名和 HTTPS
3. 小程序提交审核

---

## 📞 问题反馈

如有问题，请检查：
1. 后端服务是否运行：`curl http://localhost:3000/api/health`
2. 小程序 API 地址配置是否正确
3. 防火墙是否放行 3000 端口

---

**当前状态**: 后端运行中，小程序框架完成，需要补充更多真题数据和完善前端细节。
