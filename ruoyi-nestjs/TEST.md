# RuoYi NestJS 认证模块测试指南

## 方式一：使用 Docker Compose（推荐）

### 1. 启动服务

```bash
cd /workspace/ruoyi-nestjs
docker-compose up -d
```

首次启动会自动：
- 创建 MySQL 容器
- 初始化数据库和表结构
- 导入测试数据
- 启动 NestJS 应用

### 2. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看应用日志
docker-compose logs -f app

# 查看数据库日志
docker-compose logs -f mysql
```

### 3. 运行测试

```bash
# 自动测试脚本
./test-auth.sh

# 或者手动测试
curl http://localhost:3000/prod-api/captchaImage
```

### 4. 停止服务

```bash
docker-compose down
```

### 5. 重启服务

```bash
docker-compose restart
```

## 方式二：本地运行

### 前置条件

1. 安装 MySQL 8.0+
2. 安装 Node.js 20+
3. 创建数据库并导入数据

### 1. 初始化数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE ruoyi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入数据
mysql -u root -p ruoyi < sql/ry_20260319.sql
```

### 2. 配置环境变量

编辑 `.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=ruoyi
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

## 测试接口

### 1. 获取验证码

```bash
curl http://localhost:3000/prod-api/captchaImage
```

响应示例：
```json
{
  "code": 200,
  "msg": "操作成功",
  "captchaEnabled": true,
  "token": "xxx",
  "uuid": "xxx",
  "img": "data:image/png;base64,..."
}
```

### 2. 用户登录

```bash
curl -X POST http://localhost:3000/prod-api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

响应示例：
```json
{
  "code": 200,
  "msg": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 7200,
  "user": {
    "userId": "1",
    "loginName": "admin",
    "userName": "若依",
    "avatar": ""
  }
}
```

### 3. 获取用户信息

```bash
curl http://localhost:3000/prod-api/info \
  -H "Authorization: Bearer <your_token>"
```

响应示例：
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "permissions": ["system:user:list", "system:user:add", ...],
    "roles": ["admin"],
    "user": {
      "userId": "1",
      "loginName": "admin"
    }
  }
}
```

### 4. 用户登出

```bash
curl -X POST http://localhost:3000/prod-api/logout \
  -H "Authorization: Bearer <your_token>"
```

响应示例：
```json
{
  "code": 200,
  "msg": "退出成功"
}
```

## 访问 Swagger 文档

浏览器访问：http://localhost:3000/swagger

可以在此：
- 查看所有 API 接口
- 在线测试接口
- 查看请求/响应格式

## 常见问题

### 1. 数据库连接失败

检查 `.env` 文件中的数据库配置是否正确：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 2. Token 过期

JWT Token 默认 2 小时过期，可以：
- 重新登录获取新 token
- 修改 `.env` 中的 `JWT_EXPIRES_IN` 配置

### 3. 验证码不显示

检查是否安装了 `canvas` 包：
```bash
npm install canvas
```

### 4. 密码验证失败

RuoYi 原项目使用 Shiro 加密，本项目使用 bcrypt。
如果登录失败，可能需要：
1. 重置用户密码
2. 或者修改认证逻辑兼容 Shiro 加密

## 测试数据

默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

测试账号：
- 用户名：`ry`
- 密码：`admin123`

## 下一步

认证模块测试通过后，可以继续实现：
1. 系统管理模块（用户/角色/菜单/部门/岗位）
2. 系统监控模块
3. 系统工具模块

祝测试顺利！🎉
