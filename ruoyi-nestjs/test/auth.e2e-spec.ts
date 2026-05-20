import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /captchaImage', () => {
    it('应该返回验证码图片信息', async () => {
      const response = await request(app.getHttpServer())
        .get('/captchaImage')
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(response.body).toHaveProperty('img');
      expect(response.body).toHaveProperty('uuid');
    });
  });

  describe('GET /login', () => {
    it('应该返回登录页面信息', async () => {
      const response = await request(app.getHttpServer())
        .get('/login')
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(response.body.msg).toBe('操作成功');
    });
  });

  describe('POST /login', () => {
    it('应该成功登录并返回 token', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'admin',
          password: 'admin123',
        })
        .expect(201);

      expect(response.body.code).toBe(200);
      expect(response.body.msg).toBe('登录成功');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      authToken = response.body.token;
    });

    it('密码错误应该返回 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'admin',
          password: 'wrongpassword',
        })
        .expect(201);

      expect(response.body.code).toBe(401);
    });

    it('用户不存在应该返回 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'nonexistentuser',
          password: 'somepassword',
        })
        .expect(201);

      expect(response.body.code).toBe(401);
    });

    it('缺少用户名应该返回验证错误', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          password: 'admin123',
        })
        .expect(400);
    });

    it('缺少密码应该返回验证错误', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'admin',
        })
        .expect(400);
    });
  });

  describe('GET /register', () => {
    it('应该返回注册页面信息', async () => {
      const response = await request(app.getHttpServer())
        .get('/register')
        .expect(200);

      expect(response.body.code).toBe(200);
    });
  });

  describe('POST /register', () => {
    it('应该返回注册成功', async () => {
      const response = await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'newuser',
          password: 'password123',
        })
        .expect(201);

      expect(response.body.code).toBe(200);
      expect(response.body.msg).toBe('注册成功');
    });
  });

  describe('GET /unauth', () => {
    it('应该返回未授权信息', async () => {
      const response = await request(app.getHttpServer())
        .get('/unauth')
        .expect(200);

      expect(response.body.code).toBe(200);
    });
  });

  describe('POST /unlockscreen', () => {
    it('应该返回解锁成功', async () => {
      const response = await request(app.getHttpServer())
        .post('/unlockscreen')
        .send({
          password: 'admin123',
        })
        .expect(201);

      expect(response.body.code).toBe(200);
    });
  });

  describe('POST /logout (需要认证)', () => {
    it('有效 token 应该成功登出', async () => {
      const response = await request(app.getHttpServer())
        .post('/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body.code).toBe(200);
      expect(response.body.msg).toBe('退出成功');
    });

    it('无效 token 应该返回 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/logout')
        .set('Authorization', 'Bearer invalidtoken123')
        .expect(401);
    });

    it('没有 token 应该返回 401', async () => {
      await request(app.getHttpServer())
        .post('/logout')
        .expect(401);
    });
  });

  describe('GET /info (需要认证)', () => {
    it('有效 token 应该返回用户信息', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'admin',
          password: 'admin123',
        });

      const token = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .get('/info')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('permissions');
      expect(response.body.data).toHaveProperty('roles');
      expect(response.body.data.user).toHaveProperty('userId');
      expect(response.body.data.user).toHaveProperty('loginName');
    });

    it('没有 token 应该返回 401', async () => {
      await request(app.getHttpServer())
        .get('/info')
        .expect(401);
    });
  });
});
