import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysJob } from '../../../entities/sys-job.entity';
import { SysJobLog } from '../../../entities/sys-job-log.entity';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(SysJob)
    private readonly jobRepo: Repository<SysJob>,
    @InjectRepository(SysJobLog)
    private readonly jobLogRepo: Repository<SysJobLog>,
  ) {}

  async list(pageNum: number, pageSize: number, jobName?: string) {
    const where: any = {};
    if (jobName) where.jobName = Like(`%${jobName}%`);
    const [rows, total] = await this.jobRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(jobId: number) {
    const job = await this.jobRepo.findOne({ where: { jobId: String(jobId) } });
    if (!job) throw new NotFoundException('任务不存在');
    return { code: 200, msg: '操作成功', data: job };
  }

  async create(dto: CreateJobDto) {
    const job = this.jobRepo.create({
      ...dto,
      status: dto.status || '0',
    });
    await this.jobRepo.save(job);
    return { code: 200, msg: '操作成功' };
  }

  async update(dto: UpdateJobDto) {
    const job = await this.jobRepo.findOne({ where: { jobId: String(dto.jobId) } });
    if (!job) throw new NotFoundException('任务不存在');
    Object.assign(job, dto);
    await this.jobRepo.save(job);
    return { code: 200, msg: '操作成功' };
  }

  async remove(jobIds: string) {
    const idList = jobIds.split(',').map(id => String(id));
    await this.jobRepo.delete({ jobId: In(idList) });
    return { code: 200, msg: '操作成功' };
  }

  async run(jobId: number) {
    return { code: 200, msg: '操作成功' };
  }

  async changeStatus(dto: any) {
    const { jobId, status } = dto;
    const job = await this.jobRepo.findOne({ where: { jobId: String(jobId) } });
    if (!job) throw new NotFoundException('任务不存在');
    await this.jobRepo.update({ jobId: String(jobId) }, { status });
    return { code: 200, msg: '操作成功' };
  }

  async export(dto: any) {
    const jobs = await this.jobRepo.find({});
    return { code: 200, msg: '操作成功', data: { jobs } };
  }

  async logList(pageNum: number, pageSize: number, jobName?: string) {
    const where: any = {};
    if (jobName) where.jobName = Like(`%${jobName}%`);
    const [rows, total] = await this.jobLogRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { createTime: 'DESC' } as any,
    });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async removeLog(logIds: string) {
    await this.jobLogRepo.delete({ jobLogId: In(logIds.split(',')) });
    return { code: 200, msg: '操作成功' };
  }

  async cleanLog() {
    await this.jobLogRepo.clear();
    return { code: 200, msg: '操作成功' };
  }
}
