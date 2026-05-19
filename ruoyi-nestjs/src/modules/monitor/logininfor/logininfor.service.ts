import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysLogininfor } from '../../../entities/sys-logininfor.entity';

@Injectable()
export class LogininforService {
  constructor(
    @InjectRepository(SysLogininfor)
    private readonly logininforRepo: Repository<SysLogininfor>,
  ) {}

  async list(pageNum: number, pageSize: number, ipaddr?: string, userName?: string, status?: string) {
    const where: any = {};
    if (ipaddr) where.ipaddr = Like(`%${ipaddr}%`);
    if (userName) where.userName = Like(`%${userName}%`);
    if (status) where.status = status;
    const [rows, total] = await this.logininforRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { loginTime: 'DESC' },
    });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(infoId: number) {
    const info = await this.logininforRepo.findOne({ where: { infoId: String(infoId) } });
    if (!info) throw new NotFoundException('日志不存在');
    return { code: 200, msg: '操作成功', data: info };
  }

  async remove(infoIds: string) {
    await this.logininforRepo.delete({ infoId: In(infoIds.split(',')) });
    return { code: 200, msg: '操作成功' };
  }

  async clean() {
    await this.logininforRepo.clear();
    return { code: 200, msg: '操作成功' };
  }

  async unlock(loginName: string) {
    return { code: 200, msg: '操作成功' };
  }

  async export(dto: any) {
    const logs = await this.logininforRepo.find({ order: { loginTime: 'DESC' }, take: 100 });
    return { code: 200, msg: '操作成功', data: { logs } };
  }
}
