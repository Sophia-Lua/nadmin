import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysNotice } from '../../../entities/sys-notice.entity';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(SysNotice)
    private readonly sysNoticeRepo: Repository<SysNotice>,
  ) {}

  async list(pageNum: number, pageSize: number, noticeTitle?: string, noticeType?: string) {
    const where: any = {};
    if (noticeTitle) where.noticeTitle = Like(`%${noticeTitle}%`);
    if (noticeType) where.noticeType = noticeType;
    const [rows, total] = await this.sysNoticeRepo.findAndCount({ where, skip: (pageNum - 1) * pageSize, take: pageSize, order: { createTime: 'DESC' } });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(noticeId: number) {
    const notice = await this.sysNoticeRepo.findOne({ where: { noticeId: String(noticeId) } });
    if (!notice) throw new NotFoundException('公告不存在');
    return { code: 200, msg: '操作成功', data: notice };
  }

  async create(dto: CreateNoticeDto) {
    const notice = this.sysNoticeRepo.create({ ...dto, status: dto.status || '0' });
    await this.sysNoticeRepo.save(notice);
    return { code: 200, msg: '操作成功' };
  }

  async update(dto: UpdateNoticeDto) {
    const notice = await this.sysNoticeRepo.findOne({ where: { noticeId: String(dto.noticeId) } });
    if (!notice) throw new NotFoundException('公告不存在');
    Object.assign(notice, dto);
    await this.sysNoticeRepo.save(notice);
    return { code: 200, msg: '操作成功' };
  }

  async remove(noticeIds: string) {
    await this.sysNoticeRepo.delete({ noticeId: In(noticeIds.split(',')) });
    return { code: 200, msg: '操作成功' };
  }

  async viewUserNotices(userId: number) {
    const notices = await this.sysNoticeRepo.find({
      where: { status: '0' },
      order: { createTime: 'DESC' },
    });
    return { code: 200, msg: '操作成功', data: { notices, readIds: [] } };
  }

  async markAsRead(noticeId: number, userId: number) {
    return { code: 200, msg: '操作成功' };
  }

  async batchRead(noticeIds: string, userId: number) {
    return { code: 200, msg: '操作成功' };
  }

  async export(dto: any) {
    const notices = await this.sysNoticeRepo.find({ order: { createTime: 'DESC' } });
    return { code: 200, msg: '操作成功', data: { notices } };
  }
}
