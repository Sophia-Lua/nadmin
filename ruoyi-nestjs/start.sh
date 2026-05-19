#!/bin/bash

# RuoYi NestJS 启动脚本

echo "🚀 启动 RuoYi NestJS 服务..."

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
  echo "⚠️  .env 文件不存在，复制 .env.example 作为 .env"
  cp .env.example .env
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 启动开发服务器
echo "🔥 启动开发服务器..."
npm run start:dev
