# 🤖 机器人等级考试刷题小程序

青少年机器人技术等级考试备考神器，支持顺序练习、模拟考试、错题重做、收藏复习等功能。

![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-微信小程序-blue)

## 📱 功能特性

| 功能 | 说明 |
|------|------|
| 📝 **顺序练习** | 按题目顺序逐题练习 |
| 🎲 **随机练习** | 随机抽题，检验掌握程度 |
| 🎯 **模拟考试** | 限时组卷，真实考试体验 |
| ❌ **错题重做** | 自动收录错题，针对性复习 |
| ⭐ **收藏题目** | 重点题目一键收藏 |
| 📊 **学习统计** | 记录进度、正确率、连续打卡 |

## 🎨 界面预览

```
┌─────────────────────────────┐
│     机器人等级考试           │
│  青少年技术等级考试刷题平台  │
├─────────────────────────────┤
│  [1级] [2级] [3级] [4级]    │
│  [5级] [6级] [7级] [8级]    │
├─────────────────────────────┤
│  📚 顺序练习   📝 模拟考试  │
│  ❌ 错题重做   ⭐ 收藏练习  │
├─────────────────────────────┤
│    已做题  正确率  连续天数 │
│      128     85%      7天   │
└─────────────────────────────┘
```

## 🚀 快速开始

### 后端服务

```bash
cd backend
npm install
npm start
```

服务默认运行在 `http://localhost:3000`

### 小程序开发

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入 `miniapp` 目录
3. 修改 `app.js` 中的 `apiBaseUrl` 为后端地址
4. 开始开发

## 📁 项目结构

```
robot-exam-system/
├── backend/          # 后端服务 (Node.js + Express)
│   ├── server.js     # 主服务入口
│   ├── routes/       # API 路由
│   └── scripts/      # 数据脚本
├── miniapp/          # 微信小程序前端
│   ├── pages/        # 页面代码
│   │   ├── index/    # 首页
│   │   ├── question/ # 答题页
│   │   ├── exam/     # 模拟考试
│   │   ├── practice/ # 练习模式
│   │   └── profile/  # 个人中心
│   └── app.js        # 小程序入口
└── docker-compose.yml # Docker 部署配置
```

## 🔧 API 接口

| 接口 | 说明 |
|------|------|
| `GET /api/questions` | 获取题目列表 |
| `POST /api/exams/start` | 开始考试 |
| `POST /api/exams/:id/submit` | 提交试卷 |
| `GET /api/user/:id/stats` | 用户统计 |

更多接口详见后端代码。

## 📦 部署

### Docker 一键部署

```bash
docker-compose up -d
```

### 手动部署

1. 安装 Node.js 16+
2. 安装依赖并启动后端
3. 配置 Nginx 反向代理
4. 小程序后台配置域名白名单

## 📝 添加题目

编辑 `backend/scripts/sample-questions.js`，添加真题数据：

```javascript
{
  questionNo: '2024-1-001',
  content: '题目内容',
  type: 'single',           // single | multiple | judge
  options: [
    { key: 'A', content: '选项A' },
    { key: 'B', content: '选项B' }
  ],
  answer: 'A',
  explanation: '答案解析',
  level: 1,                 // 1-8级
  year: 2024,
  tags: ['知识点标签'],
  difficulty: 'easy'        // easy | medium | hard
}
```

## 🎯 技术栈

- **后端**: Node.js + Express
- **数据库**: MongoDB (生产) / 内存数据库 (开发)
- **前端**: 微信小程序原生开发
- **样式**: WXSS + 自定义组件

## 📄 许可证

MIT License

---

> 💡 **提示**: 当前版本为开发测试版，真题数据持续更新中。
