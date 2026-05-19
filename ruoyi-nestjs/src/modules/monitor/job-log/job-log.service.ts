import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysJobLog } from '../../../entities/sys-job-log.entity';

@Injectable()
export class JobLogService {
  constructor(
    @InjectRepository(SysJobLog)
    private readonly jobLogRepo: Repository<SysJobLog>,
  ) {}

  async list(pageNum: number, pageSize: number, jobName?: string, jobGroup?: string, status?: string) {
    const where: any = {};
    if (jobName) where.jobName = Like(`%${jobName}%`);
    if (jobGroup) where.jobGroup = jobGroup;
    if (status) where.status = status;

    const [rows, total] = await this.jobLogRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { createTime: 'DESC' },
    });

    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(jobLogId: number) {
    const log = await this.jobLogRepo.findOne({ where: { jobLogId: String(jobLogId) } });
    if (!log) throw new NotFoundException('任务日志不存在');
    return { code: 200, msg: '操作成功', data: log };
  }

  async remove(logIds: string) {
    const idList = logIds.split(',').map(id => String(id));
    await this.jobLogRepo.delete({ jobLogId: In(idList) });
    return { code: 200, msg: '操作成功' };
  }

  async clean() {
    await this.jobLogRepo.clear();
    return { code: 200, msg: '操作成功' };
  }

  async export(dto: any) {
    const logs = await this.jobLogRepo.find({ order: { createTime: 'DESC' } });
    return { code: 200, msg: '操作成功', data: { logs } };
  }
}
