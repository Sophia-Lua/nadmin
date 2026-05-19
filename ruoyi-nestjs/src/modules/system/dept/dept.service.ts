import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SysDept } from '../../../entities/sys-dept.entity';
import { CreateDeptDto, UpdateDeptDto } from './dto/dept.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(SysDept)
    private readonly sysDeptRepo: Repository<SysDept>,
  ) {}

  async list(deptName?: string, status?: string) {
    const where: any = { delFlag: '0' };
    if (deptName) where.deptName = Like(`%${deptName}%`);
    if (status) where.status = status;

    const depts = await this.sysDeptRepo.find({
      where,
      order: { orderNum: 'ASC' },
    });

    return { code: 200, msg: '操作成功', data: depts };
  }

  async treeselect() {
    const depts = await this.sysDeptRepo.find({
      where: { delFlag: '0' },
      order: { orderNum: 'ASC' },
    });
    const tree = this.buildTree(depts, '0');
    return { code: 200, msg: '操作成功', data: tree };
  }

  async detail(deptId: number) {
    const dept = await this.sysDeptRepo.findOne({ where: { deptId: String(deptId), delFlag: '0' } });
    if (!dept) throw new NotFoundException('部门不存在');
    return { code: 200, msg: '操作成功', data: dept };
  }

  async create(dto: CreateDeptDto) {
    const dept = this.sysDeptRepo.create({
      parentId: String(dto.parentId || 0),
      deptName: dto.deptName,
      orderNum: dto.orderNum || 0,
      leader: dto.leader || '',
      phone: dto.phone || '',
      email: dto.email || '',
      status: dto.status || '0',
      delFlag: '0',
    });
    await this.sysDeptRepo.save(dept);
    return { code: 200, msg: '操作成功' };
  }

  async update(dto: UpdateDeptDto) {
    const dept = await this.sysDeptRepo.findOne({ where: { deptId: String(dto.deptId), delFlag: '0' } });
    if (!dept) throw new NotFoundException('部门不存在');
    Object.assign(dept, { ...dto, parentId: dto.parentId !== undefined ? String(dto.parentId) : undefined });
    await this.sysDeptRepo.save(dept);
    return { code: 200, msg: '操作成功' };
  }

  async remove(deptId: number) {
    await this.sysDeptRepo.update({ deptId: String(deptId) }, { delFlag: '2' });
    return { code: 200, msg: '操作成功' };
  }

  async add(parentId: number) {
    return { code: 200, msg: '操作成功', data: { parentId: String(parentId) } };
  }

  async edit(deptId: number) {
    const dept = await this.sysDeptRepo.findOne({ where: { deptId: String(deptId), delFlag: '0' } });
    if (!dept) throw new NotFoundException('部门不存在');
    return { code: 200, msg: '操作成功', data: dept };
  }

  async removePage(deptId: number) {
    const dept = await this.sysDeptRepo.findOne({ where: { deptId: String(deptId), delFlag: '0' } });
    if (!dept) throw new NotFoundException('部门不存在');
    return { code: 200, msg: '操作成功', data: dept };
  }

  async updateSort(dto: any) {
    const { deptId, orderNum } = dto;
    const dept = await this.sysDeptRepo.findOne({ where: { deptId: String(deptId), delFlag: '0' } });
    if (!dept) throw new NotFoundException('部门不存在');
    await this.sysDeptRepo.update({ deptId: String(deptId) }, { orderNum });
    return { code: 200, msg: '操作成功' };
  }

  async checkDeptNameUnique(dto: any) {
    const { deptName } = dto;
    const dept = await this.sysDeptRepo.findOne({ where: { deptName, delFlag: '0' } });
    return { code: 200, msg: '操作成功', data: dept ? { hasDept: true } : { hasDept: false } };
  }

  async selectDeptTree(deptId: number) {
    const depts = await this.sysDeptRepo.find({ where: { delFlag: '0' }, order: { orderNum: 'ASC' } });
    const tree = this.buildTree(depts, '0');
    return { code: 200, msg: '操作成功', data: { depts: tree, checkedKeys: [String(deptId)] } };
  }

  async selectDeptTreeExclude(deptId: number, excludeId: number) {
    const depts = await this.sysDeptRepo.find({ where: { delFlag: '0' }, order: { orderNum: 'ASC' } });
    const tree = this.buildTree(depts, '0');
    return { code: 200, msg: '操作成功', data: { depts: tree, checkedKeys: [String(deptId)] } };
  }

  async treeData(excludeId: number) {
    const depts = await this.sysDeptRepo.find({ where: { delFlag: '0' }, order: { orderNum: 'ASC' } });
    const tree = this.buildTree(depts, '0');
    return { code: 200, msg: '操作成功', data: tree };
  }

  private buildTree(items: any[], parentId: string): any[] {
    const children = items
      .filter(m => m.parentId === parentId)
      .map(m => ({ ...m, children: this.buildTree(items, String(m.deptId)) }));
    return children.length ? children : [];
  }
}
