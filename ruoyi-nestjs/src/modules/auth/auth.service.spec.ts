import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { SysUser } from '@/entities/sys-user.entity';
import { BcryptUtil } from '@/common/utils/bcrypt.util';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<SysUser>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser: Partial<SysUser> = {
    userId: '1',
    loginName: 'admin',
    userName: '管理员',
    password: '$2b$10$hashedpassword',
    status: '0',
    delFlag: '0',
    roles: [],
  };

  const mockLoginDto: LoginDto = {
    username: 'admin',
    password: 'admin123',
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(7200),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(SysUser),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<SysUser>>(getRepositoryToken(SysUser));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  describe('validateUser - 参数验证测试', () => {
    it('应该拒绝空用户名', async () => {
      const dto: LoginDto = { username: '', password: 'admin123' };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('应该拒绝空密码', async () => {
      const dto: LoginDto = { username: 'admin', password: '' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      jest.spyOn(BcryptUtil, 'compare').mockReturnValue(false);

      await expect(service.validateUser(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser - 异常场景测试', () => {
    it('应该在用户不存在时抛出 UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('用户名或密码错误'),
      );
    });

    it('应该在数据库连接失败时抛出错误', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.validateUser(mockLoginDto)).rejects.toThrow('Database connection failed');
    });

    it('应该在密码错误时抛出 UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(BcryptUtil, 'compare').mockReturnValue(false);

      await expect(service.validateUser(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('用户名或密码错误'),
      );
    });
  });

  describe('validateUser - 边界条件测试', () => {
    it('应该接受最小长度用户名 (2 字符)', async () => {
      const dto: LoginDto = { username: 'ab', password: 'admin123' };
      const validUser = { ...mockUser, loginName: 'ab' };
      mockUserRepository.findOne.mockResolvedValue(validUser);
      jest.spyOn(BcryptUtil, 'compare').mockReturnValue(true);

      const result = await service.validateUser(dto);
      expect(result).toBeDefined();
    });

    it('应该接受最大长度用户名 (30 字符)', async () => {
      const username = 'a'.repeat(30);
      const dto: LoginDto = { username, password: 'admin123' };
      const validUser = { ...mockUser, loginName: username };
      mockUserRepository.findOne.mockResolvedValue(validUser);
      jest.spyOn(BcryptUtil, 'compare').mockReturnValue(true);

      const result = await service.validateUser(dto);
      expect(result).toBeDefined();
    });

    it('应该处理特殊字符用户名', async () => {
      const dto: LoginDto = { username: 'admin@test', password: 'admin123' };
      const specialUser = { ...mockUser, loginName: 'admin@test' };
      mockUserRepository.findOne.mockResolvedValue(specialUser);
      jest.spyOn(BcryptUtil, 'compare').mockReturnValue(true);

      const result = await service.validateUser(dto);
      expect(result).toBeDefined();
    });
  });

  describe('validateUser - 数据完整性测试', () => {
    it('应该在用户状态为停用时抛出 UnauthorizedException', async () => {
      const disabledUser = { ...mockUser, status: '1' };
      mockUserRepository.findOne.mockResolvedValue(disabledUser);

      await expect(service.validateUser(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('用户已被停用'),
      );
    });

    it('应该在用户已删除时抛出 UnauthorizedException', async () => {
      const deletedUser = { ...mockUser, delFlag: '2' };
      mockUserRepository.findOne.mockResolvedValue(deletedUser);

      await expect(service.validateUser(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('用户已被删除'),
      );
    });

    it('应该验证完整的用户实体数据', async () => {
      const completeUser = {
        ...mockUser,
        email: 'admin@example.com',
        phonenumber: '13800138000',
        sex: '0',
        avatar: 'avatar.jpg',
      };
      mockUserRepository.findOne.mockResolvedValue(completeUser);
      jest.spyOn(BcryptUtil, 'compare').mockReturnValue(true);

      const result = await service.validateUser(mockLoginDto);
      expect(result.userId).toBe('1');
      expect(result.loginName).toBe('admin');
    });
  });

  describe('login - 权限验证测试', () => {
    it('应该为正常用户生成 JWT token', async () => {
      const user = mockUser as SysUser;
      jest.spyOn(service as any, 'getUserPermissions').mockResolvedValue(['system:user:list']);
      jest.spyOn(service as any, 'getUserRoles').mockResolvedValue(['admin']);

      const result = await service.login(user);
      expect(result.token).toBeDefined();
      expect(result.expiresIn).toBe(7200);
      expect(result.user.userId).toBe('1');
    });

    it('应该为无权限用户返回空权限列表', async () => {
      const user = mockUser as SysUser;
      jest.spyOn(service as any, 'getUserPermissions').mockResolvedValue([]);
      jest.spyOn(service as any, 'getUserRoles').mockResolvedValue([]);

      const result = await service.login(user);
      expect(result.token).toBeDefined();
    });
  });

  describe('getUserPermissions - 数据完整性测试', () => {
    it('应该返回空数组当用户没有角色', async () => {
      const userWithoutRoles = { ...mockUser, roles: null };
      mockUserRepository.findOne.mockResolvedValue(userWithoutRoles);

      const permissions = await (service as any).getUserPermissions('1');
      expect(permissions).toEqual([]);
    });

    it('应该过滤已停用角色的权限', async () => {
      const userWithDisabledRole = {
        ...mockUser,
        roles: [
          {
            roleId: '1',
            roleKey: 'admin',
            status: '1',
            menus: [
              { menuId: '1', perms: 'system:user:list', menuType: 'F' },
            ],
          },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(userWithDisabledRole);

      const permissions = await (service as any).getUserPermissions('1');
      expect(permissions).toEqual([]);
    });

    it('应该只获取类型为 F 的菜单权限', async () => {
      const userWithMixedMenus = {
        ...mockUser,
        roles: [
          {
            roleId: '1',
            roleKey: 'admin',
            status: '0',
            menus: [
              { menuId: '1', perms: 'system:user:list', menuType: 'F' },
              { menuId: '2', perms: 'system', menuType: 'M' },
              { menuId: '3', perms: 'system:user', menuType: 'C' },
            ],
          },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(userWithMixedMenus);

      const permissions = await (service as any).getUserPermissions('1');
      expect(permissions).toEqual(['system:user:list']);
    });

    it('应该去重权限', async () => {
      const userWithDuplicatePerms = {
        ...mockUser,
        roles: [
          {
            roleId: '1',
            roleKey: 'admin',
            status: '0',
            menus: [
              { menuId: '1', perms: 'system:user:list', menuType: 'F' },
            ],
          },
          {
            roleId: '2',
            roleKey: 'manager',
            status: '0',
            menus: [
              { menuId: '2', perms: 'system:user:list', menuType: 'F' },
            ],
          },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(userWithDuplicatePerms);

      const permissions = await (service as any).getUserPermissions('1');
      expect(permissions).toEqual(['system:user:list']);
    });

    it('应该过滤空权限字符串', async () => {
      const userWithEmptyPerms = {
        ...mockUser,
        roles: [
          {
            roleId: '1',
            roleKey: 'admin',
            status: '0',
            menus: [
              { menuId: '1', perms: '', menuType: 'F' },
              { menuId: '2', perms: '   ', menuType: 'F' },
              { menuId: '3', perms: 'system:user:list', menuType: 'F' },
            ],
          },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(userWithEmptyPerms);

      const permissions = await (service as any).getUserPermissions('1');
      expect(permissions).toEqual(['system:user:list']);
    });
  });

  describe('getUserRoles - 边界条件测试', () => {
    it('应该返回空数组当用户不存在', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const roles = await (service as any).getUserRoles('999');
      expect(roles).toEqual([]);
    });

    it('应该只返回状态正常的角色', async () => {
      const userWithMixedRoles = {
        ...mockUser,
        roles: [
          { roleId: '1', roleKey: 'admin', status: '0' },
          { roleId: '2', roleKey: 'disabled', status: '1' },
        ],
      };
      mockUserRepository.findOne.mockResolvedValue(userWithMixedRoles);

      const roles = await (service as any).getUserRoles('1');
      expect(roles).toEqual(['admin']);
    });

    it('应该处理用户没有角色的情况', async () => {
      const userWithoutRoles = { ...mockUser, roles: [] };
      mockUserRepository.findOne.mockResolvedValue(userWithoutRoles);

      const roles = await (service as any).getUserRoles('1');
      expect(roles).toEqual([]);
    });
  });

  describe('refreshToken - 异常场景测试', () => {
    it('应该能够刷新用户 token', async () => {
      const user = mockUser as SysUser;
      jest.spyOn(service as any, 'getUserPermissions').mockResolvedValue(['system:user:list']);
      jest.spyOn(service as any, 'getUserRoles').mockResolvedValue(['admin']);

      const result = await service.refreshToken(user);
      expect(result.token).toBeDefined();
      expect(result.user.userId).toBe('1');
    });
  });
});
