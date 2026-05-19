# RuoYi 迁移到 NestJS 需求文档

## 1. 项目概述

### 1.1 项目背景
将 Java Spring Boot 项目 RuoYi (v4.8.3) 完全复刻到 Node.js + NestJS 平台，保持原项目所有接口完全一致。

### 1.2 项目目标
- 100% 兼容原 RuoYi 前端
- 所有 API 接口 URL、HTTP 方法、请求参数、返回结构完全一致
- 权限控制逻辑与原项目一致
- 支持原项目所有功能模块

## 2. 技术栈要求

| 层次 | 技术选型 |
|------|----------|
| 运行时 | Node.js 18+ |
| 框架 | NestJS 10+ |
| 语言 | TypeScript 5+ |
| 数据库 | MySQL 8.0+ |
| ORM | TypeORM 0.3+ |
| 认证 | JWT + RBAC |
| 文档 | Swagger/OpenAPI 3.0 |
| 缓存 | Redis (可选) |

## 3. 功能模块列表

### 3.1 系统管理模块

| 模块名称 | 路由前缀 | 功能描述 |
|----------|----------|----------|
| 用户管理 | `/system/user` | 用户 CRUD、导入导出、重置密码、角色分配 |
| 角色管理 | `/system/role` | 角色 CRUD、权限分配、数据权限、用户分配 |
| 菜单管理 | `/system/menu` | 菜单 CRUD、菜单树、权限标识 |
| 部门管理 | `/system/dept` | 部门 CRUD、部门树、数据范围 |
| 岗位管理 | `/system/post` | 岗位 CRUD、用户分配 |
| 字典管理 | `/system/dict` | 字典类型/数据 CRUD |
| 参数设置 | `/system/config` | 系统参数 CRUD |
| 通知公告 | `/system/notice` | 通知公告 CRUD、已读管理 |

### 3.2 系统监控模块

| 模块名称 | 路由前缀 | 功能描述 |
|----------|----------|----------|
| 在线用户 | `/monitor/online` | 在线用户查询、强退 |
| 定时任务 | `/monitor/job` | 任务调度 CRUD、执行日志 |
| 数据监控 | `/monitor/data` | Druid 数据源监控 |
| 服务监控 | `/monitor/server` | 服务器 CPU、内存、磁盘监控 |
| 缓存监控 | `/monitor/cache` | Redis 缓存监控 |
| 操作日志 | `/monitor/operlog` | 操作日志查询、导出 |
| 登录日志 | `/monitor/logininfor` | 登录日志查询、解锁、导出 |

### 3.3 系统工具模块

| 模块名称 | 路由前缀 | 功能描述 |
|----------|----------|----------|
| 表单构建 | `/tool/build` | 表单设计器 |
| 代码生成 | `/tool/gen` | 代码生成器 CRUD、预览、生成 |
| 系统接口 | `/tool/swagger` | Swagger API 文档 |

## 4. 接口详细需求

### 4.1 认证接口

| 方法 | URL | 权限标识 | 功能描述 |
|------|-----|----------|----------|
| GET | `/captchaImage` | - | 获取验证码图片 |
| GET | `/login` | - | 登录页面 |
| POST | `/login` | - | 用户登录 |
| GET | `/register` | - | 注册页面 |
| POST | `/register` | - | 用户注册 |
| GET | `/unauth` | - | 未授权跳转 |
| POST | `/logout` | - | 用户登出 |
| POST | `/unlockscreen` | - | 解锁屏幕 |

### 4.2 用户管理接口 (`/system/user`)

| 方法 | URL | 权限标识 | 功能描述 |
|------|-----|----------|----------|
| GET | `/system/user` | `system:user:view` | 用户管理页面 |
| POST | `/system/user/list` | `system:user:list` | 用户列表查询 |
| POST | `/system/user/export` | `system:user:export` | 用户数据导出 |
| POST | `/system/user/importData` | `system:user:import` | 用户数据导入 |
| GET | `/system/user/importTemplate` | `system:user:view` | 下载导入模板 |
| GET | `/system/user/add` | `system:user:add` | 新增用户页面 |
| POST | `/system/user/add` | `system:user:add` | 新增保存用户 |
| GET | `/system/user/edit/:userId` | `system:user:edit` | 修改用户页面 |
| POST | `/system/user/edit` | `system:user:edit` | 修改保存用户 |
| GET | `/system/user/view/:userId` | `system:user:list` | 查看用户详情 |
| GET | `/system/user/resetPwd/:userId` | `system:user:resetPwd` | 重置密码页面 |
| POST | `/system/user/resetPwd` | `system:user:resetPwd` | 重置密码保存 |
| GET | `/system/user/authRole/:userId` | `system:user:edit` | 授权角色页面 |
| POST | `/system/user/authRole/insertAuthRole` | `system:user:edit` | 用户授权角色 |
| POST | `/system/user/remove` | `system:user:remove` | 删除用户 |
| POST | `/system/user/checkLoginNameUnique` | - | 校验用户名 |
| POST | `/system/user/checkPhoneUnique` | - | 校验手机号 |
| POST | `/system/user/checkEmailUnique` | - | 校验邮箱 |
| POST | `/system/user/changeStatus` | `system:user:edit` | 用户状态修改 |
| GET | `/system/user/deptTreeData` | `system:user:list` | 加载部门列表树 |
| GET | `/system/user/selectDeptTree/:deptId` | `system:user:list` | 选择部门树 |

### 4.2 角色管理接口 (`/system/role`)

| 方法 | URL | 权限标识 | 功能描述 |
|------|-----|----------|----------|
| GET | `/system/role` | `system:role:view` | 角色管理页面 |
| POST | `/system/role/list` | `system:role:list` | 角色列表查询 |
| POST | `/system/role/export` | `system:role:export` | 角色数据导出 |
| GET | `/system/role/add` | `system:role:add` | 新增角色页面 |
| POST | `/system/role/add` | `system:role:add` | 新增保存角色 |
| GET | `/system/role/edit/:roleId` | `system:role:edit` | 修改角色页面 |
| POST | `/system/role/edit` | `system:role:edit` | 修改保存角色 |
| GET | `/system/role/authDataScope/:roleId` | - | 角色分配数据权限页面 |
| POST | `/system/role/authDataScope` | `system:role:edit` | 保存角色数据权限 |
| POST | `/system/role/remove` | `system:role:remove` | 删除角色 |
| POST | `/system/role/checkRoleNameUnique` | - | 校验角色名称 |
| POST | `/system/role/checkRoleKeyUnique` | - | 校验角色权限 |
| GET | `/system/role/selectMenuTree` | - | 选择菜单树 |
| POST | `/system/role/changeStatus` | `system:role:edit` | 角色状态修改 |
| GET | `/system/role/authUser/:roleId` | `system:role:edit` | 分配用户页面 |
| POST | `/system/role/authUser/allocatedList` | `system:role:list` | 查询已分配用户列表 |
| POST | `/system/role/authUser/cancel` | `system:role:edit` | 取消授权 |
| POST | `/system/role/authUser/cancelAll` | `system:role:edit` | 批量取消授权 |
| GET | `/system/role/authUser/selectUser/:roleId` | `system:role:list` | 选择用户页面 |
| POST | `/system/role/authUser/unallocatedList` | `system:role:list` | 查询未分配用户列表 |
| POST | `/system/role/authUser/selectAll` | `system:role:edit` | 批量选择用户授权 |
| GET | `/system/role/deptTreeData` | `system:role:edit` | 加载角色部门列表树 |
| GET | `/system/role/view/:roleId` | `system:role:list` | 查看角色详情 |

### 4.3 菜单管理接口 (`/system/menu`)

| 方法 | URL | 权限标识 | 功能描述 |
|------|-----|----------|----------|
| GET | `/system/menu` | `system:menu:view` | 菜单管理页面 |
| POST | `/system/menu/list` | `system:menu:list` | 菜单列表查询 |
| GET | `/system/menu/remove/:menuId` | `system:menu:remove` | 删除菜单 |
| GET | `/system/menu/add/:parentId` | `system:menu:add` | 新增菜单页面 |
| POST | `/system/menu/add` | `system:menu:add` | 新增保存菜单 |
| GET | `/system/menu/edit/:menuId` | `system:menu:edit` | 修改菜单页面 |
| POST | `/system/menu/edit` | `system:menu:edit` | 修改保存菜单 |
| POST | `/system/menu/updateSort` | `system:menu:edit` | 保存菜单排序 |
| GET | `/system/menu/icon` | - | 选择菜单图标 |
| POST | `/system/menu/checkMenuNameUnique` | - | 校验菜单名称 |
| GET | `/system/menu/roleMenuTreeData` | - | 加载角色菜单列表树 |
| GET | `/system/menu/menuTreeData` | - | 加载所有菜单列表树 |
| GET | `/system/menu/selectMenuTree/:menuId` | - | 选择菜单树 |

### 4.4 部门管理接口 (`/system/dept`)

| 方法 | URL | 权限标识 | 功能描述 |
|------|-----|----------|----------|
| GET | `/system/dept` | `system:dept:view` | 部门管理页面 |
| POST | `/system/dept/list` | `system:dept:list` | 部门列表查询 |
| GET | `/system/dept/add/:parentId` | `system:dept:add` | 新增部门页面 |
| POST | `/system/dept/add` | `system:dept:add` | 新增保存部门 |
| GET | `/system/dept/edit/:deptId` | `system:dept:edit` | 修改部门页面 |
| POST | `/system/dept/edit` | `system:dept:edit` | 修改保存部门 |
| POST | `/system/dept/updateSort` | `system:dept:edit` | 保存部门排序 |
| GET | `/system/dept/remove/:deptId` | `system:dept:remove` | 删除部门 |
| POST | `/system/dept/checkDeptNameUnique` | - | 校验部门名称唯一性 |
| GET | `/system/dept/selectDeptTree/:deptId` | - | 选择部门树 |
| GET | `/system/dept/selectDeptTree/:deptId/:excludeId` | - | 选择部门树 (排除) |
| GET | `/system/dept/treeData/:excludeId` | - | 部门树数据 |

### 4.5 岗位管理接口 (`/system/post`)

| 方法 | URL | 权限标识 | 功能描述 |
|------|-----|----------|----------|
| GET | `/system/post` | `system:post:view` | 岗位管理页面 |
| POST | `/system/post/list` | `system:post:list` | 岗位列表查询 |
| POST | `/system/post/export` | `system:post:export` | 岗位导出 |
| POST | `/system/post/remove` | `system:post:remove` | 删除岗位 |
| GET | `/system/post/add` | `system:post:add` | 新增岗位页面 |
| POST | `/system/post/add` | `system:post:add` | 新增保存岗位 |
| GET | `/system/post/edit/:postId` | `system:post:edit` | 修改岗位页面 |
| POST | `/system/post/edit` | `system:post:edit` | 修改保存岗位 |
| POST | `/system/post/checkPostNameUnique` | - | 校验岗位名称唯一性 |
| POST | `/system/post/checkPostCodeUnique` | - | 校验岗位编码唯一性 |

## 5. 数据库表结构

### 5.1 核心表列表

| 表名 | 说明 | 主键类型 |
|------|------|----------|
| `sys_dept` | 部门表 | bigint(20) |
| `sys_user` | 用户信息表 | bigint(20) |
| `sys_post` | 岗位信息表 | bigint(20) |
| `sys_role` | 角色信息表 | bigint(20) |
| `sys_menu` | 菜单权限表 | bigint(20) |
| `sys_user_role` | 用户和角色关联表 | 复合主键 |
| `sys_role_menu` | 角色和菜单关联表 | 复合主键 |
| `sys_role_dept` | 角色和部门关联表 | 复合主键 |
| `sys_user_post` | 用户与岗位关联表 | 复合主键 |
| `sys_dict_type` | 字典类型表 | bigint(20) |
| `sys_dict_data` | 字典数据表 | bigint(20) |
| `sys_config` | 参数配置表 | bigint(20) |
| `sys_notice` | 通知公告表 | bigint(20) |
| `sys_oper_log` | 操作日志记录 | bigint(20) |
| `sys_logininfor` | 登录日志表 | bigint(20) |
| `sys_user_online` | 在线用户表 | varchar(50) |
| `sys_job` | 定时任务表 | bigint(20) |
| `sys_notice_read` | 公告已读表 | bigint(20) |

### 5.2 关键字段说明

#### sys_user 表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| user_id | bigint(20) | 用户 ID |
| dept_id | bigint(20) | 部门 ID |
| login_name | varchar(30) | 登录账号 (唯一) |
| user_name | varchar(30) | 用户昵称 |
| user_type | varchar(2) | 用户类型 (00 系统用户 01 注册用户) |
| email | varchar(50) | 用户邮箱 |
| phonenumber | varchar(11) | 手机号码 |
| sex | char(1) | 用户性别 (0 男 1 女 2 未知) |
| avatar | varchar(100) | 头像路径 |
| password | varchar(50) | 密码 (加密) |
| salt | varchar(20) | 盐加密 |
| status | char(1) | 账号状态 (0 正常 1 停用) |
| del_flag | char(1) | 删除标志 (0 代表存在 2 代表删除) |
| login_ip | varchar(128) | 最后登录 IP |
| login_date | datetime | 最后登录时间 |
| pwd_update_date | datetime | 密码最后更新时间 |

#### sys_role 表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| role_id | bigint(20) | 角色 ID |
| role_name | varchar(30) | 角色名称 |
| role_key | varchar(100) | 角色权限字符串 (唯一) |
| role_sort | int(4) | 显示顺序 |
| data_scope | char(1) | 数据范围 (1 全部 2 自定义 3 本部门 4 本部门及以下) |
| status | char(1) | 角色状态 (0 正常 1 停用) |
| del_flag | char(1) | 删除标志 |

#### sys_menu 表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| menu_id | bigint(20) | 菜单 ID |
| menu_name | varchar(50) | 菜单名称 |
| parent_id | bigint(20) | 父菜单 ID |
| order_num | int(4) | 显示顺序 |
| url | varchar(200) | 请求地址 |
| target | varchar(20) | 打开方式 |
| menu_type | char(1) | 菜单类型 (M 目录 C 菜单 F 按钮) |
| visible | char(1) | 菜单状态 (0 显示 1 隐藏) |
| is_refresh | char(1) | 是否刷新 (0 刷新 1 不刷新) |
| perms | varchar(100) | 权限标识 |
| icon | varchar(100) | 菜单图标 |

## 6. 权限控制需求

### 6.1 认证机制
- 使用 JWT Token 进行身份认证
- Token 有效期：默认 30 分钟
- 支持 Refresh Token 机制
- 登录接口：`/login`

### 6.2 授权机制
- 基于 RBAC 的权限模型
- 权限标识格式：`模块：功能：操作` (如 `system:user:list`)
- 使用装饰器实现权限控制：`@RequiresPermissions('system:user:list')`
- 支持角色隔离：`@RequiresRoles('admin')`

### 6.3 数据权限
- 全部数据权限：可访问所有数据
- 自定义数据权限：按部门选择数据范围
- 本部门数据权限：仅可访问本部门数据
- 本部门及以下数据权限：可访问本部门及下属部门数据

## 7. 响应格式规范

### 7.1 标准响应结构

```typescript
// 成功响应
{
  "code": 200,
  "msg": "操作成功",
  "data": { ... }
}

// 错误响应
{
  "code": 500,
  "msg": "操作失败",
  "data": null
}
```

### 7.2 列表响应结构

```typescript
{
  "code": 200,
  "msg": "查询成功",
  "rows": [ ... ],
  "total": 100
}
```

### 7.3 分页参数

```typescript
{
  "pageNum": 1,      // 当前页码
  "pageSize": 10,    // 每页条数
  "orderByColumn": "create_time",  // 排序字段
  "isAsc": "asc"     // 排序方式 (asc/desc)
}
```

## 8. 非功能性需求

### 8.1 性能要求
- API 响应时间 < 200ms (P95)
- 支持并发用户数 >= 1000
- 数据库查询必须支持索引优化

### 8.2 安全要求
- 密码加密存储 (BCrypt)
- SQL 注入防护 (TypeORM 参数化查询)
- XSS 防护 (请求参数过滤)
- CSRF 防护
- 敏感接口限流

### 8.3 可维护性要求
- 代码注释覆盖率 >= 80%
- 所有 API 必须有 Swagger 文档
- 统一的异常处理机制
- 完整的操作日志记录

## 9. 交付物

1. 完整的 NestJS 项目源码
2. 数据库初始化脚本 (包含测试数据)
3. Swagger API 文档
4. 部署文档
5. 接口兼容性测试报告

## 10. 接口完整性检查清单

### 10.1 接口统计

| 模块分类 | 接口数量 | 已完成 |
|----------|----------|--------|
| 认证接口 | 8 | ☐ |
| 系统管理 - 用户 | 17 | ☐ |
| 系统管理 - 角色 | 20 | ☐ |
| 系统管理 - 菜单 | 13 | ☐ |
| 系统管理 - 部门 | 12 | ☐ |
| 系统管理 - 岗位 | 10 | ☐ |
| 系统管理 - 字典 | 13 | ☐ |
| 系统管理 - 参数 | 10 | ☐ |
| 系统管理 - 通知 | 13 | ☐ |
| 系统管理 - 个人中心 | 8 | ☐ |
| 系统监控 - 操作日志 | 6 | ☐ |
| 系统监控 - 登录日志 | 6 | ☐ |
| 系统监控 - 在线用户 | 4 | ☐ |
| 系统监控 - 定时任务 | 14 | ☐ |
| 系统监控 - 任务日志 | 6 | ☐ |
| 系统监控 - 服务监控 | 1 | ☐ |
| 系统监控 - 数据监控 | 1 | ☐ |
| 系统监控 - 缓存监控 | 7 | ☐ |
| 系统工具 - 代码生成 | 17 | ☐ |
| 系统工具 - 表单构建 | 1 | ☐ |
| 系统工具 - 系统接口 | 1 | ☐ |
| 公共接口 | 4 | ☐ |
| 系统首页 | 6 | ☐ |
| **总计** | **212** | |

### 10.2 权限标识完整性

所有需要权限控制的接口必须标注权限标识，格式为：`模块：功能：操作`

完整权限标识列表：

**系统管理**
- `system:user:view`, `system:user:list`, `system:user:add`, `system:user:edit`, `system:user:remove`, `system:user:export`, `system:user:import`, `system:user:resetPwd`
- `system:role:view`, `system:role:list`, `system:role:add`, `system:role:edit`, `system:role:remove`, `system:role:export`
- `system:menu:view`, `system:menu:list`, `system:menu:add`, `system:menu:edit`, `system:menu:remove`
- `system:dept:view`, `system:dept:list`, `system:dept:add`, `system:dept:edit`, `system:dept:remove`
- `system:post:view`, `system:post:list`, `system:post:add`, `system:post:edit`, `system:post:remove`, `system:post:export`
- `system:dict:view`, `system:dict:list`, `system:dict:add`, `system:dict:edit`, `system:dict:remove`, `system:dict:export`
- `system:config:view`, `system:config:list`, `system:config:add`, `system:config:edit`, `system:config:remove`, `system:config:export`
- `system:notice:view`, `system:notice:list`, `system:notice:add`, `system:notice:edit`, `system:notice:remove`

**系统监控**
- `monitor:online:view`, `monitor:online:list`, `monitor:online:batchForceLogout`, `monitor:online:forceLogout`
- `monitor:job:view`, `monitor:job:list`, `monitor:job:add`, `monitor:job:edit`, `monitor:job:remove`, `monitor:job:export`, `monitor:job:changeStatus`, `monitor:job:detail`
- `monitor:server:view`
- `monitor:data:view`
- `monitor:cache:view`
- `monitor:operlog:view`, `monitor:operlog:list`, `monitor:operlog:remove`, `monitor:operlog:detail`, `monitor:operlog:export`
- `monitor:logininfor:view`, `monitor:logininfor:list`, `monitor:logininfor:remove`, `monitor:logininfor:unlock`, `monitor:logininfor:export`

**系统工具**
- `tool:build:view`
- `tool:gen:view`, `tool:gen:list`, `tool:gen:edit`, `tool:gen:remove`, `tool:gen:preview`, `tool:gen:code`
- `tool:swagger:view`

### 10.3 接口兼容性要求

1. **URL 路径完全一致**：所有接口路径必须与原 RuoYi 项目完全一致
2. **HTTP 方法一致**：GET/POST/PUT/DELETE 方法必须与原项目一致
3. **请求参数一致**：参数名称、类型、是否必填必须一致
4. **响应结构一致**：返回的 JSON 结构、字段名称、数据类型必须一致
5. **错误码一致**：错误码和错误消息格式必须一致
6. **分页格式一致**：分页参数和返回格式必须一致

### 10.4 特殊接口说明

**文件上传接口**
- `/common/upload` - 单文件上传
- `/common/uploads` - 多文件上传
- 响应格式：`{ "code": 200, "fileName": "xxx.jpg", "url": "/path/to/file" }`

**文件下载接口**
- `/common/download` - 根据文件路径下载
- `/common/download/resource` - 资源文件下载

**验证码接口**
- `/captchaImage` - 返回 base64 编码的图片数据
- 响应格式：`{ "code": 200, "msg": "操作成功", "captchaEnabled": true, "token": "xxx", "uuid": "xxx" }`

**代码生成预览**
- `/tool/gen/preview/:tableId` - 返回多文件预览内容
- 响应格式：`{ "code": 200, "data": { "domain.java": "代码内容", "mapper.java": "代码内容", ... } }`
