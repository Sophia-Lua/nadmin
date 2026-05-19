import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Response } from 'express';
import { SysRole } from '../../../entities/sys-role.entity';
import { SysMenu } from '../../../entities/sys-menu.entity';
import { SysDept } from '../../../entities/sys-dept.entity';
import { SysUser } from '../../../entities/sys-user.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import * as Excel from 'exceljs';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(SysRole)
    private readonly sysRoleRepo: Repository<SysRole>,
    @InjectRepository(SysMenu)
    private readonly sysMenuRepo: Repository<SysMenu>,
    @InjectRepository(SysDept)
    private readonly sysDeptRepo: Repository<SysDept>,
    @InjectRepository(SysUser)
    private readonly sysUserRepo: Repository<SysUser>,
  ) {}

  async list(pageNum: number, pageSize: number, roleName?: string) {
    const where: any = { delFlag: '0' };
    if (roleName) where.roleName = Like(`%${roleName}%`);
    const [rows, total] = await this.sysRoleRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(roleId: number) {
    const role = await this.sysRoleRepo.findOne({
      where: { roleId: String(roleId), delFlag: '0' },
      relations: ['menus'],
    });
    if (!role) throw new NotFoundException('角色不存在');
    return { code: 200, msg: '操作成功', data: role };
  }

  async create(dto: CreateRoleDto) {
    const role = this.sysRoleRepo.create({
      ...dto,
      status: dto.status || '0',
      delFlag: '0',
    });
    await this.sysRoleRepo.save(role);
    return { code: 200, msg: '操作成功' };
  }

  async update(dto: UpdateRoleDto) {
    const role = await this.sysRoleRepo.findOne({
      where: { roleId: String(dto.roleId), delFlag: '0' },
    });
    if (!role) throw new NotFoundException('角色不存在');
    Object.assign(role, dto);
    await this.sysRoleRepo.save(role);
    return { code: 200, msg: '操作成功' };
  }

  async remove(roleIds: string) {
    const idList = roleIds.split(',').map(id => String(id));
    await this.sysRoleRepo.delete({ roleId: In(idList) });
    return { code: 200, msg: '操作成功' };
  }

  async deptTree(roleId: number) {
    const depts = await this.sysDeptRepo.find({
      where: { delFlag: '0' },
      order: { orderNum: 'ASC' },
    });
    return { code: 200, msg: '操作成功', data: { depts } };
  }

  async export(dto: any) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('角色数据');
    worksheet.columns = [
      { header: '角色 ID', key: 'roleId', width: 10 },
      { header: '角色名称', key: 'roleName', width: 15 },
      { header: '权限字符', key: 'roleKey', width: 15 },
      { header: '显示顺序', key: 'roleSort', width: 10 },
      { header: '状态', key: 'status', width: 10 },
    ];
    const roles = await this.sysRoleRepo.find({ where: { delFlag: '0' } });
    roles.forEach(r => {
      worksheet.addRow({
        roleId: r.roleId,
        roleName: r.roleName,
        roleKey: r.roleKey,
        roleSort: r.roleSort,
        status: r.status,
      });
    });
    return { code: 200, msg: '操作成功', data: { roles } };
  }

  async changeStatus(dto: any) {
    const { roleId, status } = dto;
    const role = await this.sysRoleRepo.findOne({ where: { roleId: String(roleId), delFlag: '0' } });
    if (!role) throw new NotFoundException('角色不存在');
    await this.sysRoleRepo.update({ roleId: String(roleId) }, { status });
    return { code: 200, msg: '操作成功' };
  }

  async authUser(roleId: number) {
    const role = await this.sysRoleRepo.findOne({
      where: { roleId: String(roleId), delFlag: '0' },
      relations: ['users'],
    });
    if (!role) throw new NotFoundException('角色不存在');
    return { code: 200, msg: '操作成功', data: { role } };
  }

  async allocatedList(dto: any) {
    const { roleId, pageNum = 1, pageSize = 10 } = dto;
    const role = await this.sysRoleRepo.findOne({
      where: { roleId: String(roleId), delFlag: '0' },
      relations: ['users'],
    });
    const users = role?.users || [];
    return { code: 200, msg: '操作成功', rows: users, total: users.length };
  }

  async cancel(dto: any) {
    const { userId, roleId } = dto;
    const user = await this.sysUserRepo.findOne({ where: { userId: String(userId) } });
    if (!user) throw new NotFoundException('用户不存在');
    const userRoleIds = user.roles?.map((r: any) => r.roleId) || [];
    user.roles = userRoleIds.filter((id: any) => id !== String(roleId)) as any;
    await this.sysUserRepo.save(user);
    return { code: 200, msg: '操作成功' };
  }

  async cancelAll(dto: any) {
    const { roleId, userIds } = dto;
    for (const userId of userIds) {
      const user = await this.sysUserRepo.findOne({ where: { userId: String(userId) } });
      if (user) {
        const userRoleIds = user.roles?.map((r: any) => r.roleId) || [];
        user.roles = userRoleIds.filter((id: any) => id !== String(roleId)) as any;
        await this.sysUserRepo.save(user);
      }
    }
    return { code: 200, msg: '操作成功' };
  }

  async selectAll(dto: any) {
    const { roleId, userIds } = dto;
    const role = await this.sysRoleRepo.findOne({ where: { roleId: String(roleId), delFlag: '0' } });
    if (!role) throw new NotFoundException('角色不存在');
    const users = await this.sysUserRepo.findByIds(userIds);
    for (const user of users) {
      const userRoleIds = user.roles?.map((r: any) => r.roleId) || [];
      if (!userRoleIds.includes(roleId)) {
        userRoleIds.push(roleId);
      }
      user.roles = userRoleIds as any;
      await this.sysUserRepo.save(user);
    }
    return { code: 200, msg: '操作成功' };
  }

  async selectUser(roleId: number) {
    const role = await this.sysRoleRepo.findOne({ where: { roleId: String(roleId), delFlag: '0' } });
    if (!role) throw new NotFoundException('角色不存在');
    return { code: 200, msg: '操作成功', data: { role } };
  }

  async unallocatedList(dto: any) {
    const { roleId, pageNum = 1, pageSize = 10, userName } = dto;
    const where: any = { delFlag: '0' };
    if (userName) where.userName = Like(`%${userName}%`);
    const [users, total] = await this.sysUserRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    return { code: 200, msg: '操作成功', rows: users, total };
  }

  async authDataScope(roleId: number) {
    const role = await this.sysRoleRepo.findOne({
      where: { roleId: String(roleId), delFlag: '0' },
      relations: ['depts'],
    });
    if (!role) throw new NotFoundException('角色不存在');
    const depts = await this.sysDeptRepo.find({ where: { delFlag: '0' } });
    return { code: 200, msg: '操作成功', data: { role, depts } };
  }

  async saveAuthDataScope(dto: any) {
    const { roleId, deptIds } = dto;
    const role = await this.sysRoleRepo.findOne({ where: { roleId: String(roleId), delFlag: '0' } });
    if (!role) throw new NotFoundException('角色不存在');
    return { code: 200, msg: '操作成功' };
  }

  async checkRoleNameUnique(dto: any) {
    const { roleName } = dto;
    const role = await this.sysRoleRepo.findOne({ where: { roleName, delFlag: '0' } });
    return { code: 200, msg: '操作成功', data: role ? { hasRole: true } : { hasRole: false } };
  }

  async checkRoleKeyUnique(dto: any) {
    const { roleKey } = dto;
    const role = await this.sysRoleRepo.findOne({ where: { roleKey, delFlag: '0' } });
    return { code: 200, msg: '操作成功', data: role ? { hasRole: true } : { hasRole: false } };
  }

  async add() {
    const menus = await this.sysMenuRepo.find({ order: { orderNum: 'ASC' } });
    return { code: 200, msg: '操作成功', data: { menus } };
  }

  async edit(roleId: number) {
    const role = await this.sysRoleRepo.findOne({
      where: { roleId: String(roleId), delFlag: '0' },
      relations: ['menus'],
    });
    if (!role) throw new NotFoundException('角色不存在');
    const menus = await this.sysMenuRepo.find({ order: { orderNum: 'ASC' } });
    return { code: 200, msg: '操作成功', data: { role, menus } };
  }

  async removePage(roleId: number) {
    const role = await this.sysRoleRepo.findOne({ where: { roleId: String(roleId), delFlag: '0' } });
    if (!role) throw new NotFoundException('角色不存在');
    return { code: 200, msg: '操作成功', data: { role } };
  }

  async view(roleId: number) {
    const role = await this.sysRoleRepo.findOne({
      where: { roleId: String(roleId), delFlag: '0' },
      relations: ['menus', 'users'],
    });
    if (!role) throw new NotFoundException('角色不存在');
    return { code: 200, msg: '操作成功', data: role };
  }

  async selectMenuTree() {
    const menus = await this.sysMenuRepo.find({ order: { orderNum: 'ASC' } });
    const tree = this.buildMenuTree(menus, 0);
    return { code: 200, msg: '操作成功', data: tree };
  }

  private buildMenuTree(menus: any[], parentId: number): any[] {
    return menus
      .filter(m => m.parentId === String(parentId))
      .map(m => ({ ...m, children: this.buildMenuTree(menus, m.menuId) }));
  }
}
