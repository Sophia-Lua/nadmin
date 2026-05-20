import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SysUserService } from './sys-user.service';
import { SysUser } from '@/entities/sys-user.entity';
import { SysRole } from '@/entities/sys-role.entity';
import { SysPost } from '@/entities/sys-post.entity';
import { SysDept } from '@/entities/sys-dept.entity';
import {
  CreateSysUserDto,
  UpdateSysUserDto,
  ResetPasswordDto,
  AuthRoleDto,
  CheckUniqueDto,
} from './dto/sys-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('SysUserService', () => {
  let service: SysUserService;
  let sysUserRepo: Repository<SysUser>;
  let sysRoleRepo: Repository<SysRole>;
  let sysPostRepo: Repository<SysPost>;
  let sysDeptRepo: Repository<SysDept>;

  const mockUser: Partial<SysUser> = {
    userId: '1',
    loginName: 'testuser',
    userName: '测试用户',
    password: '$2b$10$hashedpassword',
    status: '0',
    delFlag: '0',
    email: 'test@example.com',
    phonenumber: '13800138000',
    deptId: '103',
    roles: [],
    posts: [],
    dept: { deptId: '103', deptName: '研发部' } as SysDept,
  };

  const mockCreateUserDto: CreateSysUserDto = {
    loginName: 'newuser',
    password: 'password123',
    userName: '新用户',
    email: 'new@example.com',
    phonenumber: '13900139000',
    status: '0',
  };

  const mockUpdateUserDto: UpdateSysUserDto = {
    userId: 1,
    loginName: 'updateduser',
    userName: '更新用户',
  };

  const mockSysUserRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto, userId: '2' })),
    save: jest.fn().mockResolvedValue({}),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
  };

  const mockSysRoleRepo = {
    find: jest.fn(),
  };

  const mockSysPostRepo = {
    find: jest.fn(),
  };

  const mockSysDeptRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SysUserService,
        {
          provide: getRepositoryToken(SysUser),
          useValue: mockSysUserRepo,
        },
        {
          provide: getRepositoryToken(SysRole),
          useValue: mockSysRoleRepo,
        },
        {
          provide: getRepositoryToken(SysPost),
          useValue: mockSysPostRepo,
        },
        {
          provide: getRepositoryToken(SysDept),
          useValue: mockSysDeptRepo,
        },
      ],
    }).compile();

    service = module.get<SysUserService>(SysUserService);
    sysUserRepo = module.get<Repository<SysUser>>(getRepositoryToken(SysUser));
    sysRoleRepo = module.get<Repository<SysRole>>(getRepositoryToken(SysRole));
    sysPostRepo = module.get<Repository<SysPost>>(getRepositoryToken(SysPost));
    sysDeptRepo = module.get<Repository<SysDept>>(getRepositoryToken(SysDept));

    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
  });

  describe('list - 参数验证测试', () => {
    it('应该接受有效的分页参数', async () => {
      mockSysUserRepo.findAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await service.list(1, 10, 'test');
      expect(result.code).toBe(200);
      expect(result.rows).toBeDefined();
      expect(result.total).toBe(1);
    });

    it('应该支持按登录名模糊查询', async () => {
      mockSysUserRepo.findAndCount.mockResolvedValue([[mockUser], 1]);

      await service.list(1, 10, 'admin');

      expect(mockSysUserRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            loginName: Like('%admin%'),
          }),
        }),
      );
    });
  });

  describe('list - 边界条件测试', () => {
    it('应该返回空列表当没有用户时', async () => {
      mockSysUserRepo.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.list(1, 10);
      expect(result.rows).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('应该处理超大分页大小', async () => {
      mockSysUserRepo.findAndCount.mockResolvedValue([Array(1000).fill(mockUser), 1000]);

      const result = await service.list(1, 10000);
      expect(result.code).toBe(200);
      expect(result.rows.length).toBe(1000);
    });
  });

  describe('detail - 异常场景测试', () => {
    it('应该在用户不存在时抛出 NotFoundException', async () => {
      mockSysUserRepo.findOne.mockResolvedValue(null);

      await expect(service.detail(999)).rejects.toThrow(
        new NotFoundException('用户不存在'),
      );
    });

    it('应该在数据库异常时抛出错误', async () => {
      mockSysUserRepo.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.detail(1)).rejects.toThrow('Database error');
    });
  });

  describe('detail - 数据完整性测试', () => {
    it('应该返回完整的用户信息包括关联数据', async () => {
      const completeUser = {
        ...mockUser,
        roles: [{ roleId: '1', roleKey: 'admin', roleName: '管理员' }],
        posts: [{ postId: '1', postName: '开发' }],
        dept: { deptId: '103', deptName: '研发部' },
      };
      mockSysUserRepo.findOne.mockResolvedValue(completeUser);

      const result = await service.detail(1);
      expect(result.data.userId).toBe('1');
      expect(result.data.roles).toBeDefined();
      expect(result.data.posts).toBeDefined();
      expect(result.data.dept).toBeDefined();
    });
  });

  describe('create - 参数验证测试', () => {
    it('应该创建新用户并加密密码', async () => {
      mockSysUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);
      expect(result.code).toBe(200);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('应该接受最小长度用户名', async () => {
      const minimalDto: CreateSysUserDto = {
        ...mockCreateUserDto,
        loginName: 'ab',
      };

      mockSysUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.create(minimalDto);
      expect(result.code).toBe(200);
    });

    it('应该接受最大长度用户名', async () => {
      const maximalDto: CreateSysUserDto = {
        ...mockCreateUserDto,
        loginName: 'a'.repeat(30),
      };

      mockSysUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.create(maximalDto);
      expect(result.code).toBe(200);
    });
  });

  describe('create - 边界条件测试', () => {
    it('应该处理特殊字符用户名', async () => {
      const specialDto: CreateSysUserDto = {
        ...mockCreateUserDto,
        loginName: 'test@user#2026',
      };

      mockSysUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.create(specialDto);
      expect(result.code).toBe(200);
    });

    it('应该设置默认状态为正常', async () => {
      const noStatusDto: CreateSysUserDto = {
        ...mockCreateUserDto,
        status: undefined,
      };

      mockSysUserRepo.create.mockImplementation(dto => ({ ...dto, status: '0' }));
      mockSysUserRepo.save.mockResolvedValue(mockUser);

      await service.create(noStatusDto);

      expect(mockSysUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: '0' }),
      );
    });
  });

  describe('create - 异常场景测试', () => {
    it('应该在数据库保存失败时抛出错误', async () => {
      mockSysUserRepo.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.create(mockCreateUserDto)).rejects.toThrow('Save failed');
    });

    it('应该在密码加密失败时抛出错误', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));

      await expect(service.create(mockCreateUserDto)).rejects.toThrow('Hash failed');
    });
  });

  describe('update - 权限验证测试', () => {
    it('应该更新存在的用户', async () => {
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);
      mockSysUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.update(mockUpdateUserDto);
      expect(result.code).toBe(200);
    });

    it('应该拒绝更新不存在的用户', async () => {
      mockSysUserRepo.findOne.mockResolvedValue(null);

      await expect(service.update(mockUpdateUserDto)).rejects.toThrow(
        new NotFoundException('用户不存在'),
      );
    });
  });

  describe('update - 数据完整性测试', () => {
    it('应该更新密码时重新加密', async () => {
      const updateWithPassword: UpdateSysUserDto = {
        ...mockUpdateUserDto,
        password: 'newpassword123',
      };
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);
      mockSysUserRepo.save.mockResolvedValue(mockUser);

      await service.update(updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
    });

    it('应该部分更新用户字段', async () => {
      const partialUpdate: UpdateSysUserDto = {
        userId: 1,
        userName: '仅更新昵称',
      };
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);
      mockSysUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.update(partialUpdate);
      expect(result.code).toBe(200);
    });
  });

  describe('remove - 异常场景测试', () => {
    it('应该软删除单个用户', async () => {
      const result = await service.remove('1');
      expect(result.code).toBe(200);
      expect(mockSysUserRepo.update).toHaveBeenCalled();
    });

    it('应该批量软删除多个用户', async () => {
      const result = await service.remove('1,2,3');
      expect(result.code).toBe(200);
      expect(mockSysUserRepo.update).toHaveBeenCalled();
    });

    it('应该处理空用户 ID 列表', async () => {
      const result = await service.remove('');
      expect(result.code).toBe(200);
    });
  });

  describe('remove - 边界条件测试', () => {
    it('应该处理超大 ID 列表', async () => {
      const manyIds = Array(100).fill(0).map((_, i) => i + 1).join(',');
      const result = await service.remove(manyIds);
      expect(result.code).toBe(200);
    });
  });

  describe('resetPwd - 参数验证测试', () => {
    it('应该重置存在用户的密码', async () => {
      const resetDto: ResetPasswordDto = {
        userId: '1',
        password: 'newpassword123',
      };
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.resetPwd(resetDto);
      expect(result.code).toBe(200);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
    });

    it('应该拒绝重置不存在用户的密码', async () => {
      const resetDto: ResetPasswordDto = {
        userId: '999',
        password: 'newpassword123',
      };
      mockSysUserRepo.findOne.mockResolvedValue(null);

      await expect(service.resetPwd(resetDto)).rejects.toThrow(
        new NotFoundException('用户不存在'),
      );
    });
  });

  describe('resetPwd - 边界条件测试', () => {
    it('应该接受最小长度密码', async () => {
      const resetDto: ResetPasswordDto = {
        userId: '1',
        password: '12345',
      };
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.resetPwd(resetDto);
      expect(result.code).toBe(200);
    });

    it('应该接受最大长度密码', async () => {
      const resetDto: ResetPasswordDto = {
        userId: '1',
        password: 'a'.repeat(20),
      };
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.resetPwd(resetDto);
      expect(result.code).toBe(200);
    });
  });

  describe('authRole - 权限验证测试', () => {
    it('应该返回用户的角色授权信息', async () => {
      const userWithRoles = {
        ...mockUser,
        roles: [{ roleId: '1', roleKey: 'admin' }],
      };
      mockSysUserRepo.findOne.mockResolvedValue(userWithRoles);
      mockSysRoleRepo.find.mockResolvedValue([
        { roleId: '1', roleKey: 'admin', roleName: '管理员' },
        { roleId: '2', roleKey: 'user', roleName: '普通用户' },
      ]);

      const result = await service.authRole(1);
      expect(result.code).toBe(200);
      expect(result.data.user).toBeDefined();
      expect(result.data.roles.length).toBe(2);
    });

    it('应该拒绝授权不存在的用户', async () => {
      mockSysUserRepo.findOne.mockResolvedValue(null);

      await expect(service.authRole(999)).rejects.toThrow(
        new NotFoundException('用户不存在'),
      );
    });
  });

  describe('insertAuthRole - 数据完整性测试', () => {
    it('应该为用户分配新角色', async () => {
      const authDto: AuthRoleDto = {
        userId: '1',
        roleIds: ['1', '2'],
      };
      const userWithRoles = {
        ...mockUser,
        roles: [],
      };
      mockSysUserRepo.findOne.mockResolvedValue(userWithRoles);
      mockSysRoleRepo.find.mockResolvedValue([
        { roleId: '1', roleKey: 'admin' },
        { roleId: '2', roleKey: 'user' },
      ]);
      mockSysUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.insertAuthRole(authDto);
      expect(result.code).toBe(200);
    });

    it('应该拒绝为不存在用户分配角色', async () => {
      const authDto: AuthRoleDto = {
        userId: '999',
        roleIds: ['1'],
      };
      mockSysUserRepo.findOne.mockResolvedValue(null);

      await expect(service.insertAuthRole(authDto)).rejects.toThrow(
        new NotFoundException('用户不存在'),
      );
    });
  });

  describe('checkLoginNameUnique - 参数验证测试', () => {
    it('应该返回 true 当用户名已存在', async () => {
      const checkDto: CheckUniqueDto = { value: 'testuser' };
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.checkLoginNameUnique(checkDto);
      expect(result.data.hasUser).toBe(true);
    });

    it('应该返回 false 当用户名不存在', async () => {
      const checkDto: CheckUniqueDto = { value: 'nonexistent' };
      mockSysUserRepo.findOne.mockResolvedValue(null);

      const result = await service.checkLoginNameUnique(checkDto);
      expect(result.data.hasUser).toBe(false);
    });
  });

  describe('checkPhoneUnique - 数据完整性测试', () => {
    it('应该返回 true 当手机号已存在', async () => {
      const checkDto: CheckUniqueDto = { value: '13800138000' };
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.checkPhoneUnique(checkDto);
      expect(result.data.hasUser).toBe(true);
    });

    it('应该返回 false 当手机号不存在', async () => {
      const checkDto: CheckUniqueDto = { value: '13900139000' };
      mockSysUserRepo.findOne.mockResolvedValue(null);

      const result = await service.checkPhoneUnique(checkDto);
      expect(result.data.hasUser).toBe(false);
    });
  });

  describe('changeStatus - 异常场景测试', () => {
    it('应该更新用户状态为停用', async () => {
      mockSysUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.changeStatus({ userId: '1', status: '1' });
      expect(result.code).toBe(200);
      expect(mockSysUserRepo.update).toHaveBeenCalled();
    });

    it('应该拒绝更新不存在用户的状态', async () => {
      mockSysUserRepo.findOne.mockResolvedValue(null);

      await expect(service.changeStatus({ userId: '999', status: '1' })).rejects.toThrow(
        new NotFoundException('用户不存在'),
      );
    });
  });

  describe('deptTreeData - 数据完整性测试', () => {
    it('应该返回部门树结构', async () => {
      const depts = [
        { deptId: '1', parentId: '0', deptName: '总公司', orderNum: 1 },
        { deptId: '2', parentId: '1', deptName: '研发部', orderNum: 1 },
        { deptId: '3', parentId: '1', deptName: '市场部', orderNum: 2 },
      ];
      mockSysDeptRepo.find.mockResolvedValue(depts);

      const result = await service.deptTreeData();
      expect(result.code).toBe(200);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].children).toHaveLength(2);
    });

    it('应该处理空部门列表', async () => {
      mockSysDeptRepo.find.mockResolvedValue([]);

      const result = await service.deptTreeData();
      expect(result.data).toEqual([]);
    });
  });

  describe('importData - 异常场景测试', () => {
    it('应该拒绝空文件', async () => {
      await expect(service.importData(null, {})).rejects.toThrow(
        new BadRequestException('请上传文件'),
      );
    });
  });

  describe.skip('export - 边界条件测试', () => {
    it('跳过 Excel 导出测试', () => {
      // Excel 导出测试需要完整的 mock
    });
  });
});
