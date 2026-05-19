#!/bin/bash

# RuoYi NestJS 认证模块测试脚本

BASE_URL="http://localhost:3000/prod-api"
TOKEN=""

echo "🧪 RuoYi NestJS 认证模块测试"
echo "================================"
echo ""

# 1. 测试获取验证码
echo "1️⃣  测试获取验证码..."
CAPTCHA_RESPONSE=$(curl -s "$BASE_URL/captchaImage")
echo "响应：$CAPTCHA_RESPONSE" | jq .

UUID=$(echo "$CAPTCHA_RESPONSE" | jq -r '.uuid')
TOKEN_CAPTCHA=$(echo "$CAPTCHA_RESPONSE" | jq -r '.token')

if [ "$UUID" != "null" ] && [ -n "$UUID" ]; then
  echo "✅ 验证码获取成功"
else
  echo "❌ 验证码获取失败"
  exit 1
fi

echo ""

# 2. 测试用户登录
echo "2️⃣  测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

echo "响应：$LOGIN_RESPONSE" | jq .

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ 登录成功"
  echo "Token: $TOKEN"
else
  echo "⚠️  登录失败（可能是数据库未初始化）"
  echo "请先执行：docker-compose up -d 初始化数据库"
fi

echo ""

# 3. 测试获取用户信息（需要 token）
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "3️⃣  测试获取用户信息..."
  INFO_RESPONSE=$(curl -s "$BASE_URL/info" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "响应：$INFO_RESPONSE" | jq .
  
  if [ "$(echo "$INFO_RESPONSE" | jq -r '.code')" = "200" ]; then
    echo "✅ 用户信息获取成功"
  else
    echo "❌ 用户信息获取失败"
  fi
else
  echo "3️⃣  跳过用户信息测试（未获取到 token）"
fi

echo ""

# 4. 测试未授权访问
echo "4️⃣  测试未授权访问..."
UNAUTH_RESPONSE=$(curl -s "$BASE_URL/info")
echo "响应：$UNAUTH_RESPONSE" | jq .

if [ "$(echo "$UNAUTH_RESPONSE" | jq -r '.statusCode')" = "401" ]; then
  echo "✅ 未授权拦截正常"
else
  echo "⚠️  未授权拦截可能有问题"
fi

echo ""
echo "================================"
echo "🎉 测试完成"
