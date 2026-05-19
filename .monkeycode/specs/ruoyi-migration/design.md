# RuoYi 迁移到 NestJS 技术设计文档

## 1. 系统架构设计

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Client (RuoYi UI)                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   NestJS Application                     │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐   │
│  │   Gateway   │  │   Filter    │  │  Interceptor  │   │
│  └─────────────┘  └─────────────┘  └───────────────┘   │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐   │
│  │  Controller │  │   Service   │  │    Repository │   │
│  └─────────────┘  └─────────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      MySQL Database                      │
│  sys_user | sys_role | sys_menu | sys_dept | ...        │
└─────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

| 组件 | 技术选型 | 版本 |
|------|----------|------|
| 运行时 | Node.js | 20+ LTS |
| 框架 | NestJS | 11+ |
| 语言 | TypeScript | 5.3+ |
| ORM | TypeORM | 0.3.20+ |
| 数据库 | MySQL | 8.0+ |
| 认证 | @nestjs/jwt | 11+ |
| 认证 | @nestjs/passport | 11+ |
| 认证 | passport-jwt | 4+ |
| 验证 | class-validator | 0.14.1+ |
| 验证 | class-transformer | 0.5.1+ |
| 文档 | @nestjs/swagger | 8.0+ |
| 日志 | winston | 3.14+ |
| 日志 | nestjs-winston | 1.0+ |
| 缓存 | @nestjs/cache-manager | 3+ |
| 缓存 | cache-manager | 6+ |
| Redis | @nestjs/throttler | 6+ |
| 工具 | lodash | 4.17+ |
| 工具 | dayjs | 1.11+ |
| 工具 | bcrypt | 5.1+ |
| Excel | exceljs | 4.4+ |
| 定时任务 | @nestjs/schedule | 5+ |
| 定时任务 | cron | 3+ |
| 测试 | @nestjs/testing | 11+ |
| 测试 | jest | 29.7+ |

## 2. 项目目录结构

```
ruoyi-nestjs/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── requires-permissions.decorator.ts
│   │   │   ├── requires-roles.decorator.ts
│   │   │   ├── log.decorator.ts
│   │   │   └── index.ts
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── all-exceptions.filter.ts
│   │   │   └── index.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── permissions.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── index.ts
│   │   ├── interceptors/
│   │   │   ├── response.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── index.ts
│   │   ├── pipes/
│   │   │   ├── validate.pipe.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── bcrypt.util.ts
│   │   │   ├── jwt.util.ts
│   │   │   ├── excel.util.ts
│   │   │   └── index.ts
│   │   └── constants/
│   │       ├── error-code.constants.ts
│   │       ├── common.constants.ts
│   │       └── index.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── index.ts
│   ├── entities/
│   │   ├── sys-user.entity.ts
│   │   ├── sys-role.entity.ts
│   │   ├── sys-menu.entity.ts
│   │   ├── sys-dept.entity.ts
│   │   ├── sys-post.entity.ts
│   │   ├── sys-dict-type.entity.ts
│   │   ├── sys-dict-data.entity.ts
│   │   ├── sys-config.entity.ts
│   │   ├── sys-notice.entity.ts
│   │   ├── sys-oper-log.entity.ts
│   │   ├── sys-logininfor.entity.ts
│   │   ├── sys-user-online.entity.ts
│   │   ├── sys-job.entity.ts
│   │   ├── sys-role-menu.entity.ts
│   │   ├── sys-role-dept.entity.ts
│   │   ├── sys-user-role.entity.ts
│   │   ├── sys-user-post.entity.ts
│   │   ├── sys-notice-read.entity.ts
│   │   └── index.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── vo/
│   │   │       ├── login.vo.ts
│   │   │       └── index.ts
│   │   ├── system/
│   │   │   ├── user/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.module.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-user.dto.ts
│   │   │   │   │   ├── update-user.dto.ts
│   │   │   │   │   └── query-user.dto.ts
│   │   │   │   └── vo/
│   │   │   │       ├── user.vo.ts
│   │   │   │       └── index.ts
│   │   │   ├── role/
│   │   │   │   ├── role.controller.ts
│   │   │   │   ├── role.service.ts
│   │   │   │   ├── role.module.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-role.dto.ts
│   │   │   │   │   ├── update-role.dto.ts
│   │   │   │   │   └── query-role.dto.ts
│   │   │   │   └── vo/
│   │   │   │       ├── role.vo.ts
│   │   │   │       └── index.ts
│   │   │   ├── menu/
│   │   │   │   ├── menu.controller.ts
│   │   │   │   ├── menu.service.ts
│   │   │   │   ├── menu.module.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-menu.dto.ts
│   │   │   │   │   ├── update-menu.dto.ts
│   │   │   │   │   └── query-menu.dto.ts
│   │   │   │   └── vo/
│   │   │   │       ├── menu.vo.ts
│   │   │   │       └── index.ts
│   │   │   ├── dept/
│   │   │   │   ├── dept.controller.ts
│   │   │   │   ├── dept.service.ts
│   │   │   │   ├── dept.module.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-dept.dto.ts
│   │   │   │   │   ├── update-dept.dto.ts
│   │   │   │   │   └── query-dept.dto.ts
│   │   │   │   └── vo/
│   │   │   │       ├── dept.vo.ts
│   │   │   │       └── index.ts
│   │   │   ├── post/
│   │   │   │   ├── post.controller.ts
│   │   │   │   ├── post.service.ts
│   │   │   │   ├── post.module.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-post.dto.ts
│   │   │   │   │   ├── update-post.dto.ts
│   │   │   │   │   └── query-post.dto.ts
│   │   │   │   └── vo/
│   │   │   │       ├── post.vo.ts
│   │   │   │       └── index.ts
│   │   │   ├── dict/
│   │   │   │   ├── dict-type.controller.ts
│   │   │   │   ├── dict-type.service.ts
│   │   │   │   ├── dict-data.controller.ts
│   │   │   │   ├── dict-data.service.ts
│   │   │   │   ├── dict.module.ts
│   │   │   │   └── dto/
│   │   │   │   └── vo/
│   │   │   ├── config/
│   │   │   │   ├── config.controller.ts
│   │   │   │   ├── config.service.ts
│   │   │   │   ├── config.module.ts
│   │   │   │   └── dto/
│   │   │   │   └── vo/
│   │   │   └── notice/
│   │   │       ├── notice.controller.ts
│   │   │       ├── notice.service.ts
│   │   │       ├── notice.module.ts
│   │   │       └── dto/
│   │   │       └── vo/
│   │   ├── monitor/
│   │   │   ├── online/
│   │   │   │   ├── online.controller.ts
│   │   │   │   ├── online.service.ts
│   │   │   │   └── online.module.ts
│   │   │   ├── job/
│   │   │   │   ├── job.controller.ts
│   │   │   │   ├── job.service.ts
│   │   │   │   ├── job.module.ts
│   │   │   │   └── dto/
│   │   │   │   └── vo/
│   │   │   ├── server/
│   │   │   │   ├── server.controller.ts
│   │   │   │   ├── server.service.ts
│   │   │   │   └── server.module.ts
│   │   │   ├── cache/
│   │   │   │   ├── cache.controller.ts
│   │   │   │   ├── cache.service.ts
│   │   │   │   └── cache.module.ts
│   │   │   ├── operlog/
│   │   │   │   ├── operlog.controller.ts
│   │   │   │   ├── operlog.service.ts
│   │   │   │   └── operlog.module.ts
│   │   │   └── logininfor/
│   │   │       ├── logininfor.controller.ts
│   │   │       ├── logininfor.service.ts
│   │   │       └── logininfor.module.ts
│   │   └── tool/
│   │       ├── gen/
│   │       │   ├── gen.controller.ts
│   │       │   ├── gen.service.ts
│   │       │   ├── gen.module.ts
│   │       │   └── dto/
│   │       │   └── vo/
│   │       └── build/
│   │           ├── build.controller.ts
│   │           └── build.module.ts
│   ├── app.module.ts
│   ├── main.ts
│   └── app.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── sql/
│   ├── schema.sql
│   └── data.sql
├── .env
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

## 3. 核心模块设计

### 3.1 TypeORM 实体设计

#### SysUser 实体

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { SysDept } from './sys-dept.entity';
import { SysRole } from './sys-role.entity';
import { SysPost } from './sys-post.entity';

@Entity('sys_user')
export class SysUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  userId: string;

  @Column({ type: 'bigint', nullable: true })
  deptId: string;

  @Column({ type: 'varchar', length: 30, name: 'login_name' })
  loginName: string;

  @Column({ type: 'varchar', length: 30, default: '', name: 'user_name' })
  userName: string;

  @Column({ type: 'varchar', length: 2, default: '00', name: 'user_type' })
  userType: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  email: string;

  @Column({ type: 'varchar', length: 11, default: '' })
  phonenumber: string;

  @Column({ type: 'char', length: 1, default: '0' })
  sex: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  avatar: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  password: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  salt: string;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'del_flag' })
  delFlag: string;

  @Column({ type: 'varchar', length: 128, default: '', name: 'login_ip' })
  loginIp: string;

  @Column({ type: 'datetime', nullable: true, name: 'login_date' })
  loginDate: Date;

  @Column({ type: 'datetime', nullable: true, name: 'pwd_update_date' })
  pwdUpdateDate: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'create_by' })
  createBy: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ type: 'datetime', name: 'update_time' })
  updateTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string;

  @ManyToOne(() => SysDept, dept => dept.users)
  @JoinColumn({ name: 'dept_id' })
  dept: SysDept;

  @ManyToMany(() => SysRole, role => role.users)
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
  })
  roles: SysRole[];

  @ManyToMany(() => SysPost, post => post.users)
  @JoinTable({
    name: 'sys_user_post',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'postId' },
  })
  posts: SysPost[];
}
```

#### SysRole 实体

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SysUser } from './sys-user.entity';
import { SysMenu } from './sys-menu.entity';
import { SysDept } from './sys-dept.entity';

@Entity('sys_role')
export class SysRole {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  roleId: string;

  @Column({ type: 'varchar', length: 30, name: 'role_name' })
  roleName: string;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'role_key' })
  roleKey: string;

  @Column({ type: 'int', name: 'role_sort' })
  roleSort: number;

  @Column({ type: 'char', length: 1, default: '1', name: 'data_scope' })
  dataScope: string;

  @Column({ type: 'char', length: 1, default: '0' })
  status: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'del_flag' })
  delFlag: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'create_by' })
  createBy: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ type: 'datetime', name: 'update_time' })
  updateTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string;

  @ManyToMany(() => SysUser, user => user.roles)
  users: SysUser[];

  @ManyToMany(() => SysMenu, menu => menu.roles)
  @JoinTable({
    name: 'sys_role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'menuId' },
  })
  menus: SysMenu[];

  @ManyToMany(() => SysDept, dept => dept.roles)
  @JoinTable({
    name: 'sys_role_dept',
    joinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
    inverseJoinColumn: { name: 'dept_id', referencedColumnName: 'deptId' },
  })
  depts: SysDept[];
}
```

#### SysMenu 实体

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SysRole } from './sys-role.entity';

@Entity('sys_menu')
export class SysMenu {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  menuId: string;

  @Column({ type: 'varchar', length: 50, name: 'menu_name' })
  menuName: string;

  @Column({ type: 'bigint', default: 0, name: 'parent_id' })
  parentId: string;

  @Column({ type: 'int', default: 0, name: 'order_num' })
  orderNum: number;

  @Column({ type: 'varchar', length: 200, default: '#' })
  url: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  target: string;

  @Column({ type: 'char', length: 1, default: '', name: 'menu_type' })
  menuType: string;

  @Column({ type: 'char', length: 1, default: '0' })
  visible: string;

  @Column({ type: 'char', length: 1, default: '1', name: 'is_refresh' })
  isRefresh: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  perms: string;

  @Column({ type: 'varchar', length: 100, default: '#' })
  icon: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'create_by' })
  createBy: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_time' })
  createTime: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ type: 'datetime', name: 'update_time' })
  updateTime: Date;

  @Column({ type: 'varchar', length: 500, default: '' })
  remark: string;

  @ManyToMany(() => SysRole, role => role.menus)
  roles: SysRole[];
}
```

### 3.2 认证模块设计

#### JWT Strategy

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      loginName: payload.loginName,
      permissions: payload.permissions,
      roles: payload.roles,
    };
  }
}
```

#### Auth Service

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { SysUser } from '@/entities/sys-user.entity';
import { LoginDto } from './dto/login.dto';
import { SysUserService } from '@/modules/system/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: SysUserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<SysUser> {
    const user = await this.userService.findByLoginName(loginDto.username);
    
    if (!user || user.status !== '0' || user.delFlag !== '0') {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return user;
  }

  async login(user: SysUser) {
    const payload = {
      sub: user.userId,
      loginName: user.loginName,
      permissions: await this.userService.getPermissions(user.userId),
      roles: await this.userService.getRoles(user.userId),
    };

    return {
      token: this.jwtService.sign(payload),
      expiresIn: 7200, // 2 小时
      user: {
        userId: user.userId,
        loginName: user.loginName,
        userName: user.userName,
        avatar: user.avatar,
      },
    };
  }
}
```

### 3.3 权限控制设计

#### RequiresPermissions 装饰器

```typescript
import { SetMetadata } from '@nestjs/common';

export const REQUIRES_PERMISSIONS_KEY = 'requires_permissions';

export const RequiresPermissions = (...permissions: string[]) =>
  SetMetadata(REQUIRES_PERMISSIONS_KEY, permissions);
```

#### Permissions Guard

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRES_PERMISSIONS_KEY } from '@/common/decorators/requires-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRES_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      return false;
    }

    return requiredPermissions.some(permission =>
      user.permissions.includes(permission),
    );
  }
}
```

#### Log 装饰器 (操作日志)

```typescript
import { SetMetadata } from '@nestjs/common';
import { BusinessType } from '@/common/constants';

export const LOG_KEY = 'log_metadata';

export interface LogMetadata {
  title: string;
  businessType: BusinessType;
}

export const Log = (metadata: LogMetadata) =>
  SetMetadata(LOG_KEY, metadata);
```

### 3.4 响应拦截器

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  msg: string;
  data?: T;
  rows?: T[];
  total?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        const response: Response<T> = {
          code: 200,
          msg: '操作成功',
          data,
        };

        // 处理分页响应
        if (data && Array.isArray(data['rows']) && 'total' in data) {
          response.rows = data['rows'];
          response.total = data['total'];
          delete response.data;
        }

        return response;
      }),
    );
  }
}
```

## 4. 控制器设计示例

### 4.1 用户管理控制器

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SysUserService } from './user.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { RequiresPermissions } from '@/common/decorators/requires-permissions.decorator';
import { Log } from '@/common/decorators/log.decorator';
import { BusinessType } from '@/common/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('系统管理 / 用户管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/user')
export class SysUserController {
  constructor(private readonly userService: SysUserService) {}

  @Get()
  @RequiresPermissions('system:user:view')
  @ApiOperation({ summary: '用户管理页面' })
  user() {
    return { view: 'system/user/user' };
  }

  @Post('list')
  @RequiresPermissions('system:user:list')
  @ApiOperation({ summary: '用户列表查询' })
  async list(@Body() query: QueryUserDto) {
    const result = await this.userService.findAll(query);
    return result;
  }

  @Post('export')
  @Log({ title: '用户管理', businessType: BusinessType.EXPORT })
  @RequiresPermissions('system:user:export')
  @ApiOperation({ summary: '用户数据导出' })
  async export(@Body() query: QueryUserDto) {
    const list = await this.userService.findAllWithoutPage(query);
    return this.userService.exportExcel(list);
  }

  @Get('add')
  @RequiresPermissions('system:user:add')
  @ApiOperation({ summary: '新增用户页面' })
  async add() {
    const roles = await this.userService.findAllRoles();
    const posts = await this.userService.findAllPosts();
    return { roles, posts };
  }

  @Post('add')
  @Log({ title: '用户管理', businessType: BusinessType.INSERT })
  @RequiresPermissions('system:user:add')
  @ApiOperation({ summary: '新增保存用户' })
  async add(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return { code: 200, msg: '操作成功', data: result };
  }

  @Get('edit/:userId')
  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: '修改用户页面' })
  async edit(@Param('userId', ParseIntPipe) userId: string) {
    const user = await this.userService.findById(userId);
    const roles = await this.userService.findRolesByUserId(userId);
    const posts = await this.userService.findPostsByUserId(userId);
    return { user, roles, posts };
  }

  @Post('edit')
  @Log({ title: '用户管理', businessType: BusinessType.UPDATE })
  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: '修改保存用户' })
  async update(@Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.update(updateUserDto);
    return { code: 200, msg: '操作成功', data: result };
  }

  @Post('remove')
  @Log({ title: '用户管理', businessType: BusinessType.DELETE })
  @RequiresPermissions('system:user:remove')
  @ApiOperation({ summary: '删除用户' })
  async remove(@Body('ids') ids: string) {
    const result = await this.userService.remove(ids);
    return { code: 200, msg: '操作成功', data: result };
  }

  @Post('changeStatus')
  @Log({ title: '用户管理', businessType: BusinessType.UPDATE })
  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: '用户状态修改' })
  async changeStatus(@Body() user: Partial<CreateUserDto>) {
    const result = await this.userService.changeStatus(user);
    return { code: 200, msg: '操作成功', data: result };
  }

  @Get('deptTreeData')
  @RequiresPermissions('system:user:list')
  @ApiOperation({ summary: '加载部门列表树' })
  async deptTreeData() {
    return this.userService.getDeptTreeData();
  }
}
```

## 5. 数据库设计

### 5.1 表结构 SQL

完整 SQL 见 `/workspace/ruoyi-source/sql/ry_20260319.sql`

### 5.2 索引设计

```sql
-- 用户表索引
CREATE INDEX idx_sys_user_dept ON sys_user(dept_id);
CREATE INDEX idx_sys_user_login_name ON sys_user(login_name);
CREATE INDEX idx_sys_user_status ON sys_user(status);

-- 角色表索引
CREATE INDEX idx_sys_role_role_key ON sys_role(role_key);
CREATE INDEX idx_sys_role_status ON sys_role(status);

-- 菜单表索引
CREATE INDEX idx_sys_menu_parent_id ON sys_menu(parent_id);

-- 操作日志索引
CREATE INDEX idx_sys_oper_log_bt ON sys_oper_log(business_type);
CREATE INDEX idx_sys_oper_log_s ON sys_oper_log(status);
CREATE INDEX idx_sys_oper_log_ot ON sys_oper_log(oper_time);

-- 登录日志索引
CREATE INDEX idx_sys_logininfor_s ON sys_logininfor(status);
CREATE INDEX idx_sys_logininfor_lt ON sys_logininfor(login_time);
```

## 6. Java 到 Node.js 实现对照

### 12.1 密码加密对照

**Java (Shiro):**
```java
String salt = ShiroUtils.randomSalt();
String password = passwordService.encryptPassword(loginName, password, salt);
// SimpleHash hash = new SimpleHash(algorithmName, password, salt, hashIterations);
```

**Node.js (BCrypt):**
```typescript
import { genSaltSync, hashSync } from 'bcrypt';

const salt = genSaltSync(10);
const password = hashSync(plainPassword, salt);
```

### 6.2 分页实现对照

**Java (PageHelper):**
```java
startPage();
List<SysUser> list = userService.selectUserList(user);
return getDataTable(list);
```

**Node.js (TypeORM):**
```typescript
const [data, total] = await this.userRepository.findAndCount({
  where: conditions,
  skip: (pageNum - 1) * pageSize,
  take: pageSize,
  order: { [orderByColumn]: isAsc === 'asc' ? 'ASC' : 'DESC' },
});

return { rows: data, total };
```

### 6.3 权限检查对照

**Java (Shiro Annotation):**
```java
@RequiresPermissions("system:user:add")
public AjaxResult add(@Validated SysUser user) { ... }
```

**Node.js (NestJS Decorator):**
```typescript
@RequiresPermissions('system:user:add')
async add(@Body() createUserDto: CreateUserDto) { ... }
```

### 6.4 数据范围权限对照

**Java:**
```java
deptService.checkDeptDataScope(user.getDeptId());
roleService.checkRoleDataScope(user.getRoleIds());
```

**Node.js:**
```typescript
async checkDeptDataScope(deptId: string, userId: string) {
  const user = await this.userRepository.findOne({ where: { userId } });
  const dept = await this.deptRepository.findOne({ where: { deptId } });
  
  if (user.deptId !== deptId && !this.isAdmin(user)) {
    throw new ForbiddenException('没有权限访问该部门');
  }
}
```

## 7. API 文档配置

### 7.1 Swagger 配置

```typescript
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('RuoYi NestJS API')
    .setDescription('RuoYi 后台管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
```

### 7.2 DTO 示例

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class QueryUserDto {
  @ApiProperty({ description: '登录账号', required: false })
  @IsOptional()
  @IsString()
  loginName?: string;

  @ApiProperty({ description: '手机号码', required: false })
  @IsOptional()
  @IsString()
  phonenumber?: string;

  @ApiProperty({ description: '用户状态', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '部门 ID', required: false })
  @IsOptional()
  @IsString()
  deptId?: string;

  @ApiProperty({ description: '页码', default: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  @ApiProperty({ description: '每页条数', default: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiProperty({ description: '排序字段', required: false })
  @IsOptional()
  @IsString()
  orderByColumn?: string;

  @ApiProperty({ description: '排序方式', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsString()
  isAsc?: 'asc' | 'desc' = 'asc';
}
```

## 8. 部署配置

### 8.1 Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=root
      - DB_PASSWORD=ruoyi123
      - DB_DATABASE=ruoyi
      - JWT_SECRET=your-secret-key
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=ruoyi123
      - MYSQL_DATABASE=ruoyi
      - MYSQL_CHARSET=utf8mb4
      - MYSQL_COLLATION=utf8mb4_unicode_ci
    volumes:
      - mysql_data:/var/lib/mysql
      - ./sql:/docker-entrypoint-initdb.d
    restart: unless-stopped

volumes:
  mysql_data:
```

### 8.2 环境变量

```bash
# .env
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=ruoyi123
DB_DATABASE=ruoyi
DB_CHARSET=utf8mb4

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7200

# Server
PORT=3000
PREFIX=/prod-api

# Swagger
SWAGGER_ENABLED=true
```

## 9. 开发计划

### 阶段一：基础框架搭建 (1-2 天)
- [ ] 项目初始化
- [ ] TypeORM 配置
- [ ] JWT 认证实现
- [ ] 基础实体类定义
- [ ] 公共模块实现 (装饰器、守卫、拦截器)
- [ ] 登录/认证模块
- [ ] 验证码接口

### 阶段二：核心模块开发 (3-6 天)
- [ ] 用户管理模块 (17 个接口)
- [ ] 角色管理模块 (20 个接口)
- [ ] 菜单管理模块 (13 个接口)
- [ ] 部门管理模块 (12 个接口)
- [ ] 岗位管理模块 (10 个接口)

### 阶段三：辅助模块开发 (7-9 天)
- [ ] 字典管理模块 (13 个接口)
- [ ] 参数设置模块 (10 个接口)
- [ ] 通知公告模块 (13 个接口)
- [ ] 个人中心模块 (8 个接口)

### 阶段四：监控工具模块 (10-13 天)
- [ ] 在线用户模块 (4 个接口)
- [ ] 定时任务模块 (14 个接口)
- [ ] 任务日志模块 (6 个接口)
- [ ] 服务监控模块 (1 个接口)
- [ ] 数据监控模块 (1 个接口)
- [ ] 缓存监控模块 (7 个接口)
- [ ] 操作日志模块 (6 个接口)
- [ ] 登录日志模块 (6 个接口)

### 阶段五：工具模块开发 (14-16 天)
- [ ] 代码生成器 (17 个接口)
- [ ] 表单构建器 (1 个接口)
- [ ] Swagger 文档集成 (1 个接口)
- [ ] 文件上传/下载 (4 个接口)

### 阶段六：测试与优化 (17-20 天)
- [ ] 单元测试 (覆盖率>80%)
- [ ] 集成测试 (所有 API)
- [ ] 接口兼容性测试 (212 个接口)
- [ ] 性能优化 (响应时间<200ms)
- [ ] 安全加固 (SQL 注入、XSS、CSRF)
- [ ] 文档完善

## 10. 接口实现检查清单

### 10.1 接口统计总览

| 模块分类 | 接口数量 | 实现状态 |
|----------|----------|----------|
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

### 10.2 测试用例要求

每个接口需要包含以下测试：
- [ ] 正常场景测试
- [ ] 异常场景测试
- [ ] 权限验证测试
- [ ] 参数验证测试
- [ ] 数据完整性测试
- [ ] 边界条件测试

## 12. Java 到 Node.js 实现对照

### 12.1 密码加密对照

**Java (Shiro):**
```java
String salt = ShiroUtils.randomSalt();
String password = passwordService.encryptPassword(loginName, password, salt);
// SimpleHash hash = new SimpleHash(algorithmName, password, salt, hashIterations);
```

**Node.js (BCrypt):**
```typescript
import { genSaltSync, hashSync } from 'bcrypt';

const salt = genSaltSync(10);
const password = hashSync(plainPassword, salt);
```

### 12.2 分页实现对照

**Java (PageHelper):**
```java
startPage();
List<SysUser> list = userService.selectUserList(user);
return getDataTable(list);
```

**Node.js (TypeORM):**
```typescript
const [data, total] = await this.userRepository.findAndCount({
  where: conditions,
  skip: (pageNum - 1) * pageSize,
  take: pageSize,
  order: { [orderByColumn]: isAsc === 'asc' ? 'ASC' : 'DESC' },
});

return { rows: data, total };
```

### 12.3 权限检查对照

**Java (Shiro Annotation):**
```java
@RequiresPermissions("system:user:add")
public AjaxResult add(@Validated SysUser user) { ... }
```

**Node.js (NestJS Decorator):**
```typescript
@RequiresPermissions('system:user:add')
async add(@Body() createUserDto: CreateUserDto) { ... }
```

### 12.4 数据范围权限对照

**Java:**
```java
deptService.checkDeptDataScope(user.getDeptId());
roleService.checkRoleDataScope(user.getRoleIds());
```

**Node.js:**
```typescript
async checkDeptDataScope(deptId: string, userId: string) {
  const user = await this.userRepository.findOne({ where: { userId } });
  const dept = await this.deptRepository.findOne({ where: { deptId } });
  
  if (user.deptId !== deptId && !this.isAdmin(user)) {
    throw new ForbiddenException('没有权限访问该部门');
  }
}
```

## 13. API 文档配置

### 13.1 Swagger 配置

```typescript
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('RuoYi NestJS API')
    .setDescription('RuoYi 后台管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
```

### 13.2 DTO 示例

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class QueryUserDto {
  @ApiProperty({ description: '登录账号', required: false })
  @IsOptional()
  @IsString()
  loginName?: string;

  @ApiProperty({ description: '手机号码', required: false })
  @IsOptional()
  @IsString()
  phonenumber?: string;

  @ApiProperty({ description: '用户状态', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: '部门 ID', required: false })
  @IsOptional()
  @IsString()
  deptId?: string;

  @ApiProperty({ description: '页码', default: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  @ApiProperty({ description: '每页条数', default: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiProperty({ description: '排序字段', required: false })
  @IsOptional()
  @IsString()
  orderByColumn?: string;

  @ApiProperty({ description: '排序方式', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsString()
  isAsc?: 'asc' | 'desc' = 'asc';
}
```

## 14. 部署配置

### 14.1 Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=root
      - DB_PASSWORD=ruoyi123
      - DB_DATABASE=ruoyi
      - JWT_SECRET=your-secret-key
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=ruoyi123
      - MYSQL_DATABASE=ruoyi
      - MYSQL_CHARSET=utf8mb4
      - MYSQL_COLLATION=utf8mb4_unicode_ci
    volumes:
      - mysql_data:/var/lib/mysql
      - ./sql:/docker-entrypoint-initdb.d
    restart: unless-stopped

volumes:
  mysql_data:
```

### 14.2 环境变量

```bash
# .env
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=ruoyi123
DB_DATABASE=ruoyi
DB_CHARSET=utf8mb4

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7200

# Server
PORT=3000
PREFIX=/prod-api

# Swagger
SWAGGER_ENABLED=true
```
