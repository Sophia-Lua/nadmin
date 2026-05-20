import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './../src/common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';
import { PermissionsGuard } from './../src/common/guards/permissions.guard';
import { Reflector } from '@nestjs/core';

describe('RuoYi NestJS 集成测试 (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.setGlobalPrefix('/prod-api');
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalGuards(new PermissionsGuard(new Reflector()));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalInterceptors(new LoggingInterceptor());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. 认证模块', () => {
    it('GET /prod-api/captchaImage 应返回验证码', async () => {
      const res = await request(app.getHttpServer()).get('/prod-api/captchaImage');
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body).toHaveProperty('img');
      expect(res.body).toHaveProperty('uuid');
    });

    it('POST /prod-api/login 应成功登录', async () => {
      const res = await request(app.getHttpServer())
        .post('/prod-api/login')
        .send({ username: 'admin', password: 'admin123' });
      expect(res.status).toBe(201);
      expect(res.body.code).toBe(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });

    it('POST /prod-api/login 密码错误应返回 401', async () => {
      const res = await request(app.getHttpServer())
        .post('/prod-api/login')
        .send({ username: 'admin', password: 'wrong' });
      expect(res.status).toBe(201);
      expect(res.body.code).toBe(401);
    });

    it('GET /prod-api/info 应返回用户信息', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/info')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('permissions');
      expect(res.body.data).toHaveProperty('roles');
    });

    it('POST /prod-api/logout 应成功登出', async () => {
      const res = await request(app.getHttpServer())
        .post('/prod-api/logout')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(201);
      expect(res.body.code).toBe(200);
    });
  });

  describe('2. 系统管理模块', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'admin', password: 'admin123' });
      authToken = res.body.token;
    });

    describe('用户管理', () => {
      it('GET /system/user/list 应返回用户列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/user/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body).toHaveProperty('rows');
        expect(res.body).toHaveProperty('total');
      });

      it('GET /system/user/deptTreeData 应返回部门树', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/user/deptTreeData')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
      });
    });

    describe('角色管理', () => {
      it('GET /system/role/list 应返回角色列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/role/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body).toHaveProperty('rows');
      });
    });

    describe('菜单管理', () => {
      it('GET /system/menu/list 应返回菜单列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/menu/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
      });
    });

    describe('部门管理', () => {
      it('GET /system/dept/list 应返回部门列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/dept/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
      });
    });

    describe('岗位管理', () => {
      it('GET /system/post/list 应返回岗位列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/post/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body).toHaveProperty('rows');
      });
    });

    describe('字典管理', () => {
      it('GET /system/dict/type/list 应返回字典类型列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/dict/type/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body).toHaveProperty('rows');
      });
    });

    describe('参数设置', () => {
      it('GET /system/config/list 应返回参数列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/config/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body).toHaveProperty('rows');
      });
    });

    describe('通知公告', () => {
      it('GET /system/notice/list 应返回公告列表', async () => {
        const res = await request(app.getHttpServer())
          .get('/prod-api/system/notice/list')
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body).toHaveProperty('rows');
      });
    });
  });

  describe('3. 系统监控模块', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'admin', password: 'admin123' });
      authToken = res.body.token;
    });

    it('GET /monitor/operlog/list 应返回操作日志', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/monitor/operlog/list')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
    });

    it('GET /monitor/logininfor/list 应返回登录日志', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/monitor/logininfor/list')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
    });

    it('GET /monitor/online/list 应返回在线用户', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/monitor/online/list')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
    });

    it('GET /monitor/job/list 应返回定时任务', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/monitor/job/list')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
    });

    it('GET /monitor/server 应返回服务器信息', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/monitor/server')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data).toHaveProperty('cpu');
      expect(res.body.data).toHaveProperty('mem');
    });

    it('GET /monitor/data 应返回数据监控', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/monitor/data')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
    });

    it('GET /monitor/cache 应返回缓存信息', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/monitor/cache')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
    });
  });

  describe('4. 系统工具模块', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'admin', password: 'admin123' });
      authToken = res.body.token;
    });

    it('GET /tool/gen/list 应返回代码生成表列表', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/tool/gen/list')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body).toHaveProperty('rows');
    });

    it('GET /tool/build 应返回表单构建页面', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/tool/build')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
    });
  });

  describe('5. 系统首页', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'admin', password: 'admin123' });
      authToken = res.body.token;
    });

    it('GET /system/index 应返回首页数据', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/system/index')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data).toHaveProperty('visitCount');
      expect(res.body.data).toHaveProperty('userCount');
    });

    it('GET /system/main 应返回主页数据', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/system/main')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data).toHaveProperty('dynamicList');
    });
  });

  describe('6. 权限验证', () => {
    it('无 token 访问受保护接口应返回 401', async () => {
      const res = await request(app.getHttpServer()).get('/prod-api/system/user/list');
      expect(res.body.code).toBe(401);
    });

    it('无效 token 应返回 401', async () => {
      const res = await request(app.getHttpServer())
        .get('/prod-api/system/user/list')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.body.code).toBe(401);
    });
  });

  describe('7. 响应格式统一', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send({ username: 'admin', password: 'admin123' });
      authToken = res.body.token;
    });

    it('所有成功响应应包含 code 和 msg', async () => {
      const endpoints = [
        '/system/user/list',
        '/system/role/list',
        '/system/menu/list',
        '/system/dept/list',
        '/system/post/list',
      ];

      for (const endpoint of endpoints) {
        const res = await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${authToken}`);
        expect(res.body).toHaveProperty('code');
        expect(res.body).toHaveProperty('msg');
      }
    });
  });
});
