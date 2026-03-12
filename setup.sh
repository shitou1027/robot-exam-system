#!/bin/bash

echo "🚀 机器人等级考试刷题系统 - 开发环境部署"
echo "======================================"

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 18+"
    echo "   安装指南: https://nodejs.org/"
    exit 1
fi

# 检查Node版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js 版本过低，建议升级到 18+"
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 进入后端目录
cd backend

# 安装依赖
echo "📦 安装后端依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"
echo ""

# 检查 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  未检测到 MongoDB"
    echo "   你可以选择以下方式之一："
    echo "   1. 使用 Docker: docker-compose up -d mongodb"
    echo "   2. 本地安装 MongoDB"
    echo "   3. 使用 MongoDB Atlas 云服务"
    echo ""
    echo "   暂时跳过数据库初始化..."
else
    echo "✅ 检测到 MongoDB"
    
    # 初始化数据库
    echo "🗄️  初始化数据库..."
    node scripts/init-db.js
    
    if [ $? -eq 0 ]; then
        echo "✅ 数据库初始化完成"
    else
        echo "⚠️  数据库初始化失败，请检查 MongoDB 连接"
    fi
fi

echo ""
echo "======================================"
echo "🎉 开发环境部署完成！"
echo ""
echo "📖 使用指南："
echo ""
echo "1. 启动后端服务:"
echo "   cd backend && npm run dev"
echo ""
echo "2. 访问 API:"
echo "   http://localhost:3000"
echo ""
echo "3. 小程序开发:"
echo "   - 下载微信开发者工具"
echo "   - 导入 miniapp 目录"
echo "   - 修改 app.js 中的 apiBaseUrl"
echo ""
echo "4. 默认管理员账号:"
echo "   用户名: admin"
echo "   密码: admin123"
echo ""
echo "5. 使用 Docker 一键启动（可选）:"
echo "   docker-compose up -d"
echo ""
