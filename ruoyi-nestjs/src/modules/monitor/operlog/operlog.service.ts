import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysOperLog } from '../../../entities/sys-oper-log.entity';

@Injectable()
export class OperlogService {
  constructor(
    @InjectRepository(SysOperLog)
    private readonly operLogRepo: Repository<SysOperLog>,
  ) {}

  async list(pageNum: number, pageSize: number, title?: string, operName?: string) {
    const where: any = {};
    if (title) where.title = Like(`%${title}%`);
    if (operName) where.operName = Like(`%${operName}%`);
    const [rows, total] = await this.operLogRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { operTime: 'DESC' } as any,
    });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(infoId: number) {
    const operlog = await this.operLogRepo.findOne({ where: { infoId: String(infoId) } as any });
    if (!operlog) throw new NotFoundException('日志不存在');
    return { code: 200, msg: '操作成功', data: operlog };
  }

  async remove(infoIds: string) {
    await this.operLogRepo.delete({ infoId: In(infoIds.split(',')) } as any);
    return { code: 200, msg: '操作成功' };
  }

  async clean() {
    await this.operLogRepo.clear();
    return { code: 200, msg: '操作成功' };
  }

  async export(dto: any) {
    const logs = await this.operLogRepo.find({ order: { operTime: 'DESC' } as any, take: 100 });
    return { code: 200, msg: '操作成功', data: { logs } };
  }
}
