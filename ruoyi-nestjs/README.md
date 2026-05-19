# RuoYi NestJS

RuoYi 后台管理系统 Node.js 实现版本，基于 NestJS + TypeScript + TypeORM。

## 技术栈

- **运行时**: Node.js 20+ LTS
- **框架**: NestJS 11+
- **语言**: TypeScript 5.3+
- **ORM**: TypeORM 0.3.20+
- **数据库**: MySQL 8.0+
- **认证**: JWT + Passport
- **文档**: Swagger/OpenAPI 3.0

## 快速开始

### 1. 环境要求

- Node.js >= 20
- MySQL >= 8.0
- npm >= 10

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接信息：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=ruoyi
```

### 4. 初始化数据库

```bash
mysql -u root -p < sql/ry_20260319.sql
```

### 5. 启动服务

开发模式：

```bash
npm run start:dev
```

生产模式：

```bash
npm run build
npm run start:prod
```

### 6. 访问

- 服务地址：http://localhost:3000
- Swagger 文档：http://localhost:3000/swagger

## 项目结构

```
ruoyi-nestjs/
├── src/
│   ├── common/           # 公共模块
│   │   ├── constants/    # 常量定义
│   │   ├── decorators/   # 装饰器
│   │   ├── guards/       # 守卫
│   │   ├── interceptors/ # 拦截器
│   │   ├── interfaces/   # 接口定义
│   │   ├── utils/        # 工具类
│   ├── config/           # 配置文件
│   ├── entities/         # 实体类
│   ├── modules/          # 业务模块
│   │   ├── auth/         # 认证模块
│   │   ├── system/       # 系统管理模块
│   │   ├── monitor/      # 系统监控模块
│   │   └── tool/         # 系统工具模块
│   ├── app.module.ts     # 根模块
│   └── main.ts           # 入口文件
├── sql/                  # SQL 脚本
├── test/                 # 测试文件
├── .env                  # 环境变量
└── package.json
```

## 功能模块

### 系统管理
- 用户管理
- 角色管理
- 菜单管理
- 部门管理
- 岗位管理
- 字典管理
- 参数设置
- 通知公告

### 系统监控
- 在线用户
- 定时任务
- 操作日志
- 登录日志
- 服务监控
- 缓存监控

### 系统工具
- 代码生成
- 表单构建
- 系统接口

## API 接口

完整 API 文档请访问：http://localhost:3000/swagger

### 认证接口
- `POST /prod-api/login` - 用户登录
- `GET /prod-api/captchaImage` - 获取验证码
- `POST /prod-api/logout` - 用户登出

### 用户接口
- `GET /prod-api/system/user/list` - 用户列表
- `POST /prod-api/system/user/add` - 新增用户
- `POST /prod-api/system/user/edit` - 修改用户
- `POST /prod-api/system/user/remove` - 删除用户

## 开发规范

### 代码风格

遵循 TypeScript ESLint 规范。

### 提交规范

```
feat: 新增功能
fix: 修复 bug
refactor: 重构代码
docs: 文档更新
test: 测试用例
chore: 构建/工具配置
```

## 测试

运行单元测试：

```bash
npm run test
```

运行端到端测试：

```bash
npm run test:e2e
```

## 部署

### Docker 部署

```bash
docker-compose up -d
```

### 生产环境

1. 构建项目：`npm run build`
2. 配置生产环境变量
3. 启动服务：`npm run start:prod`

## 许可证

MIT

## 相关链接

- [RuoYi 原项目](https://gitee.com/y_project/RuoYi)
- [NestJS 文档](https://docs.nestjs.com/)
- [TypeORM 文档](https://typeorm.io/)
