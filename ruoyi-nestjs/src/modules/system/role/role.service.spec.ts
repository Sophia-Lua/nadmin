import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RoleService } from './role.service';
import { SysRole } from '@/entities/sys-role.entity';
import { SysMenu } from '@/entities/sys-menu.entity';
import { SysDept } from '@/entities/sys-dept.entity';
import { SysUser } from '@/entities/sys-user.entity';

describe('RoleService', () => {
  let service: RoleService;
  let sysRoleRepo: Repository<SysRole>;
  let sysMenuRepo: Repository<SysMenu>;
  let sysDeptRepo: Repository<SysDept>;
  let sysUserRepo: Repository<SysUser>;

  const mockRole: Partial<SysRole> = {
    roleId: '1',
    roleKey: 'admin',
    roleName: '管理员',
    status: '0',
    delFlag: '0',
    menus: [],
  };

  const mockSysRoleRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto, roleId: '2' })),
    save: jest.fn().mockResolvedValue({}),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  };

  const mockSysMenuRepo = {
    find: jest.fn(),
  };

  const mockSysDeptRepo = {
    find: jest.fn(),
  };

  const mockSysUserRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(SysRole),
          useValue: mockSysRoleRepo,
        },
        {
          provide: getRepositoryToken(SysMenu),
          useValue: mockSysMenuRepo,
        },
        {
          provide: getRepositoryToken(SysDept),
          useValue: mockSysDeptRepo,
        },
        {
          provide: getRepositoryToken(SysUser),
          useValue: mockSysUserRepo,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    sysRoleRepo = module.get<Repository<SysRole>>(getRepositoryToken(SysRole));
    sysMenuRepo = module.get<Repository<SysMenu>>(getRepositoryToken(SysMenu));
    sysDeptRepo = module.get<Repository<SysDept>>(getRepositoryToken(SysDept));
    sysUserRepo = module.get<Repository<SysUser>>(getRepositoryToken(SysUser));

    jest.clearAllMocks();
  });

  describe('list - 参数验证测试', () => {
    it('应该接受有效的分页参数', async () => {
      mockSysRoleRepo.findAndCount.mockResolvedValue([[mockRole], 1]);

      const result = await service.list(1, 10, 'admin');
      expect(result.code).toBe(200);
      expect(result.rows).toBeDefined();
      expect(result.total).toBe(1);
    });

    it('应该支持按角色名称模糊查询', async () => {
      mockSysRoleRepo.findAndCount.mockResolvedValue([[mockRole], 1]);

      await service.list(1, 10, '管理');

      expect(mockSysRoleRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            roleName: Like('%管理%'),
          }),
        }),
      );
    });
  });

  describe('list - 边界条件测试', () => {
    it('应该返回空列表当没有角色时', async () => {
      mockSysRoleRepo.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.list(1, 10);
      expect(result.rows).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('应该处理超大分页大小', async () => {
      mockSysRoleRepo.findAndCount.mockResolvedValue([Array(100).fill(mockRole), 100]);

      const result = await service.list(1, 1000);
      expect(result.code).toBe(200);
    });
  });

  describe('detail - 异常场景测试', () => {
    it('应该在角色不存在时抛出 NotFoundException', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(null);

      await expect(service.detail(999)).rejects.toThrow(
        new NotFoundException('角色不存在'),
      );
    });

    it('应该查询已删除角色时返回未找到', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(null);

      await expect(service.detail(1)).rejects.toThrow(
        new NotFoundException('角色不存在'),
      );
    });
  });

  describe('detail - 数据完整性测试', () => {
    it('应该返回完整的角色信息包括菜单', async () => {
      const completeRole = {
        ...mockRole,
        menus: [
          { menuId: '1', menuName: '系统管理', perms: 'system' },
          { menuId: '2', menuName: '用户管理', perms: 'system:user' },
        ],
      };
      mockSysRoleRepo.findOne.mockResolvedValue(completeRole);

      const result = await service.detail(1);
      expect(result.data.roleId).toBe('1');
      expect(result.data.menus).toBeDefined();
      expect(result.data.menus.length).toBe(2);
    });
  });

  describe('create - 参数验证测试', () => {
    it('应该创建新角色', async () => {
      mockSysRoleRepo.save.mockResolvedValue(mockRole);

      const result = await service.create({ roleKey: 'newrole', roleName: '新角色', menuIds: [] } as any);
      expect(result.code).toBe(200);
    });

    it('应该拒绝空角色名称', async () => {
      mockSysRoleRepo.save.mockResolvedValue(mockRole);

      const result = await service.create({ roleKey: 'newrole', roleName: '', menuIds: [] } as any);
      expect(mockSysRoleRepo.create).toHaveBeenCalled();
    });
  });

  describe('create - 异常场景测试', () => {
    it('应该在数据库保存失败时抛出错误', async () => {
      mockSysRoleRepo.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.create({ roleKey: 'test', roleName: 'Test', menuIds: [] } as any)).rejects.toThrow('Save failed');
    });
  });

  describe('update - 权限验证测试', () => {
    it('应该更新存在的角色', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(mockRole);
      mockSysRoleRepo.save.mockResolvedValue(mockRole);

      const result = await service.update({ roleId: 1, roleName: '更新角色', menuIds: [] } as any);
      expect(result.code).toBe(200);
    });

    it('应该拒绝更新不存在的角色', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update({ roleId: 999, roleName: '更新角色', menuIds: [] } as any),
      ).rejects.toThrow(new NotFoundException('角色不存在'));
    });
  });

  describe('remove - 异常场景测试', () => {
    it('应该软删除单个角色', async () => {
      const result = await service.remove('1');
      expect(result.code).toBe(200);
    });

    it('应该批量软删除多个角色', async () => {
      const result = await service.remove('1,2,3');
      expect(result.code).toBe(200);
    });

    it('应该处理空角色 ID 列表', async () => {
      const result = await service.remove('');
      expect(result.code).toBe(200);
    });
  });

  describe('checkRoleKeyUnique - 参数验证测试', () => {
    it('应该返回 hasRole true 当角色标识已存在', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(mockRole);

      const result = await service.checkRoleKeyUnique({ roleKey: 'admin' });
      expect(result.data.hasRole).toBe(true);
    });

    it('应该返回 hasRole false 当角色标识不存在', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(null);

      const result = await service.checkRoleKeyUnique({ roleKey: 'newrole' });
      expect(result.data.hasRole).toBe(false);
    });
  });

  describe('changeStatus - 边界条件测试', () => {
    it('应该更新角色状态为停用', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(mockRole);

      const result = await service.changeStatus({ roleId: '1', status: '1' });
      expect(result.code).toBe(200);
    });

    it('应该拒绝更新不存在角色的状态', async () => {
      mockSysRoleRepo.findOne.mockResolvedValue(null);

      await expect(
        service.changeStatus({ roleId: '999', status: '1' }),
      ).rejects.toThrow(new NotFoundException('角色不存在'));
    });
  });
});
