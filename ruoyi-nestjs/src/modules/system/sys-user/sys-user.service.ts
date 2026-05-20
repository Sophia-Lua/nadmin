import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Response } from 'express';
import { SysUser } from '../../../entities/sys-user.entity';
import { SysRole } from '../../../entities/sys-role.entity';
import { SysPost } from '../../../entities/sys-post.entity';
import { SysDept } from '../../../entities/sys-dept.entity';
import { CreateSysUserDto, UpdateSysUserDto, ResetPasswordDto, AuthRoleDto, CheckUniqueDto } from './dto/sys-user.dto';
import * as bcrypt from 'bcrypt';
import * as Excel from 'exceljs';

@Injectable()
export class SysUserService {
  constructor(
    @InjectRepository(SysUser)
    private readonly sysUserRepo: Repository<SysUser>,
    @InjectRepository(SysRole)
    private readonly sysRoleRepo: Repository<SysRole>,
    @InjectRepository(SysPost)
    private readonly sysPostRepo: Repository<SysPost>,
    @InjectRepository(SysDept)
    private readonly sysDeptRepo: Repository<SysDept>,
  ) {}

  async list(pageNum: number, pageSize: number, loginName?: string) {
    const where: any = { delFlag: '0' };
    if (loginName) {
      where.loginName = Like(`%${loginName}%`);
    }

    const [rows, total] = await this.sysUserRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: ['dept'],
    });

    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(userId: number) {
    const user = await this.sysUserRepo.findOne({
      where: { userId: String(userId), delFlag: '0' },
      relations: ['roles', 'posts', 'dept'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return { code: 200, msg: '操作成功', data: user };
  }

  async create(dto: CreateSysUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    
    const user = this.sysUserRepo.create({
      ...dto,
      password: hashedPassword,
      salt: '',
      status: dto.status || '0',
      delFlag: '0',
      userType: '00',
    });

    await this.sysUserRepo.save(user);

    return { code: 200, msg: '操作成功' };
  }

  async update(dto: UpdateSysUserDto) {
    const user = await this.sysUserRepo.findOne({
      where: { userId: String(dto.userId), delFlag: '0' },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
    }

    Object.assign(user, dto);
    await this.sysUserRepo.save(user);

    return { code: 200, msg: '操作成功' };
  }

  async remove(userIds: string) {
    const idList = userIds.split(',').map(id => String(id));
    await this.sysUserRepo.update({ userId: In(idList) }, { delFlag: '2' });
    return { code: 200, msg: '操作成功' };
  }

  async deptTree() {
    const depts = await this.sysDeptRepo.find({
      where: { delFlag: '0' },
      order: { orderNum: 'ASC' },
    });
    return { code: 200, msg: '操作成功', data: { depts } };
  }

  async roleList() {
    const roles = await this.sysRoleRepo.find({
      where: { delFlag: '0', status: '0' },
    });
    return { code: 200, msg: '操作成功', data: { roles } };
  }

  async postList() {
    const posts = await this.sysPostRepo.find({
      where: { status: '0' },
      order: { postSort: 'ASC' },
    });
    return { code: 200, msg: '操作成功', data: { posts } };
  }

  async roleAndPostList() {
    const [roles, posts] = await Promise.all([
      this.sysRoleRepo.find({ where: { delFlag: '0', status: '0' } }),
      this.sysPostRepo.find({ where: { status: '0' } }),
    ]);
    return { code: 200, msg: '操作成功', data: { roles, posts } };
  }

  async export(dto: any, res: Response) {
    const users = await this.sysUserRepo.find({
      where: { delFlag: '0' },
      select: ['userId', 'loginName', 'userName', 'deptId', 'email', 'phonenumber', 'sex', 'status', 'createTime'],
      relations: ['dept'],
    });

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('用户数据');

    worksheet.columns = [
      { header: '用户 ID', key: 'userId', width: 10 },
      { header: '登录名', key: 'loginName', width: 15 },
      { header: '用户名', key: 'userName', width: 15 },
      { header: '部门', key: 'deptName', width: 20 },
      { header: '邮箱', key: 'email', width: 25 },
      { header: '手机', key: 'phonenumber', width: 15 },
      { header: '性别', key: 'sex', width: 10 },
      { header: '状态', key: 'status', width: 10 },
      { header: '创建时间', key: 'createTime', width: 20 },
    ];

    users.forEach(u => {
      worksheet.addRow({
        userId: u.userId,
        loginName: u.loginName,
        userName: u.userName,
        deptName: u.dept?.deptName || '',
        email: u.email,
        phonenumber: u.phonenumber,
        sex: u.sex === '0' ? '男' : u.sex === '1' ? '女' : '未知',
        status: u.status === '0' ? '正常' : '停用',
        createTime: u.createTime ? new Date(u.createTime).toLocaleString('zh-CN') : '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="用户数据.xlsx"');
    await workbook.xlsx.write(res);
  }

  async importData(file: any, body: any) {
    if (!file) {
      throw new BadRequestException('请上传文件');
    }

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];
    const data: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      data.push({
        loginName: row.getCell(1).value,
        userName: row.getCell(2).value,
        deptId: row.getCell(3).value,
        email: row.getCell(4).value,
        phonenumber: row.getCell(5).value,
        sex: row.getCell(6).value,
        status: row.getCell(7).value,
      });
    });

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const row of data) {
      try {
        const loginName = String(row.loginName || '').trim();
        if (!loginName) continue;

        const existing = await this.sysUserRepo.findOne({
          where: { loginName, delFlag: '0' },
        });

        if (existing) {
          failCount++;
          errors.push(`${loginName}: 用户已存在`);
          continue;
        }

        const user = this.sysUserRepo.create({
          loginName,
          userName: String(row.userName || ''),
          deptId: row.deptId ? String(row.deptId) : undefined,
          email: String(row.email || ''),
          phonenumber: String(row.phonenumber || ''),
          sex: row.sex === '男' ? '0' : row.sex === '女' ? '1' : '0',
          status: row.status === '正常' ? '0' : '1',
          password: await bcrypt.hash('123456', 12),
          salt: '',
          delFlag: '0',
          userType: '00',
        });

        await this.sysUserRepo.save(user);
        successCount++;
      } catch (e) {
        failCount++;
        errors.push(`${row.loginName}: ${e.message}`);
      }
    }

    return {
      code: 200,
      msg: '操作成功',
      data: { total: data.length, successCount, failCount, errors: errors.slice(0, 10) },
    };
  }

  async importTemplate(res: Response) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('模板');

    worksheet.columns = [
      { header: '登录名', key: 'loginName', width: 15 },
      { header: '用户名', key: 'userName', width: 15 },
      { header: '部门 ID', key: 'deptId', width: 10 },
      { header: '邮箱', key: 'email', width: 25 },
      { header: '手机', key: 'phonenumber', width: 15 },
      { header: '性别', key: 'sex', width: 10 },
      { header: '状态', key: 'status', width: 10 },
    ];

    worksheet.addRow({
      loginName: 'test',
      userName: '测试用户',
      deptId: '103',
      email: 'test@example.com',
      phonenumber: '13800138000',
      sex: '男',
      status: '正常',
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="用户模板.xlsx"');
    await workbook.xlsx.write(res);
  }

  async resetPwd(dto: ResetPasswordDto) {
    const user = await this.sysUserRepo.findOne({
      where: { userId: dto.userId, delFlag: '0' },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    await this.sysUserRepo.update(
      { userId: dto.userId },
      { password: hashedPassword, pwdUpdateDate: new Date() },
    );

    return { code: 200, msg: '操作成功' };
  }

  async authRole(userId: number) {
    const user = await this.sysUserRepo.findOne({
      where: { userId: String(userId), delFlag: '0' },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const roles = await this.sysRoleRepo.find({
      where: { delFlag: '0', status: '0' },
    });

    const roleIds = user.roles.map(r => r.roleId);

    return {
      code: 200,
      msg: '操作成功',
      data: {
        user: { userId: user.userId, loginName: user.loginName, userName: user.userName },
        roles,
        roleIds,
      },
    };
  }

  async insertAuthRole(dto: AuthRoleDto) {
    const user = await this.sysUserRepo.findOne({
      where: { userId: dto.userId, delFlag: '0' },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const roles = await this.sysRoleRepo.find({
      where: { roleId: In(dto.roleIds), delFlag: '0' },
    });

    user.roles = roles;
    await this.sysUserRepo.save(user);

    return { code: 200, msg: '操作成功' };
  }

  async changeStatus(dto: any) {
    const { userId, status } = dto;

    const user = await this.sysUserRepo.findOne({
      where: { userId: String(userId), delFlag: '0' },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.sysUserRepo.update({ userId: String(userId) }, { status });

    return { code: 200, msg: '操作成功' };
  }

  async checkLoginNameUnique(dto: CheckUniqueDto) {
    const user = await this.sysUserRepo.findOne({
      where: { loginName: dto.value, delFlag: '0' },
    });

    return { code: 200, msg: '操作成功', data: user ? { hasUser: true } : { hasUser: false } };
  }

  async checkPhoneUnique(dto: CheckUniqueDto) {
    const user = await this.sysUserRepo.findOne({
      where: { phonenumber: dto.value, delFlag: '0' },
    });

    return { code: 200, msg: '操作成功', data: user ? { hasUser: true } : { hasUser: false } };
  }

  async checkEmailUnique(dto: CheckUniqueDto) {
    const user = await this.sysUserRepo.findOne({
      where: { email: dto.value, delFlag: '0' },
    });

    return { code: 200, msg: '操作成功', data: user ? { hasUser: true } : { hasUser: false } };
  }

  async selectDeptTree(deptId: number) {
    const depts = await this.sysDeptRepo.find({
      where: { delFlag: '0' },
      order: { orderNum: 'ASC' },
    });

    const tree = this.buildDeptTree(depts, 0);

    return {
      code: 200,
      msg: '操作成功',
      data: { depts: tree, checkedKeys: [String(deptId)] },
    };
  }

  async add() {
    const [roles, posts, depts] = await Promise.all([
      this.sysRoleRepo.find({ where: { delFlag: '0', status: '0' } }),
      this.sysPostRepo.find({ where: { status: '0' } }),
      this.sysDeptRepo.find({ where: { delFlag: '0' }, order: { orderNum: 'ASC' } }),
    ]);
    return { code: 200, msg: '操作成功', data: { roles, posts, depts } };
  }

  async edit(userId: number) {
    const [user, roles, posts, depts] = await Promise.all([
      this.sysUserRepo.findOne({
        where: { userId: String(userId), delFlag: '0' },
        relations: ['roles', 'posts', 'dept'],
      }),
      this.sysRoleRepo.find({ where: { delFlag: '0', status: '0' } }),
      this.sysPostRepo.find({ where: { status: '0' } }),
      this.sysDeptRepo.find({ where: { delFlag: '0' }, order: { orderNum: 'ASC' } }),
    ]);
    return { code: 200, msg: '操作成功', data: { user, roles, posts, depts } };
  }

  async view(userId: number) {
    const user = await this.sysUserRepo.findOne({
      where: { userId: String(userId), delFlag: '0' },
      relations: ['roles', 'posts', 'dept'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return { code: 200, msg: '操作成功', data: user };
  }

  async resetPwdPage(userId: number) {
    const user = await this.sysUserRepo.findOne({
      where: { userId: String(userId), delFlag: '0' },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return { code: 200, msg: '操作成功', data: { user } };
  }

  async deptTreeData() {
    const depts = await this.sysDeptRepo.find({
      where: { delFlag: '0' },
      order: { orderNum: 'ASC' },
    });
    const tree = this.buildDeptTree(depts, 0);
    return { code: 200, msg: '操作成功', data: tree };
  }

  private buildDeptTree(depts: any[], parentId: string | number): any[] {
    return depts
      .filter(d => d.parentId === String(parentId))
      .map(d => ({ ...d, children: this.buildDeptTree(depts, d.deptId) }));
  }
}
