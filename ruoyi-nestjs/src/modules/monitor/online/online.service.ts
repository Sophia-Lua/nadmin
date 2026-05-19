import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUserOnline } from '../../../entities/sys-user-online.entity';

@Injectable()
export class OnlineService {
  constructor(
    @InjectRepository(SysUserOnline)
    private readonly userOnlineRepo: Repository<SysUserOnline>,
  ) {}

  async list(ipaddr?: string, userName?: string) {
    const where: any = {};
    if (ipaddr) where.ipaddr = ipaddr;
    if (userName) where.userName = userName;
    const rows = await this.userOnlineRepo.find({ where });
    return { code: 200, msg: '操作成功', rows, total: rows.length };
  }

  async forceLogout(tokenId: string) {
    await this.userOnlineRepo.delete({ tokenId } as any);
    return { code: 200, msg: '操作成功' };
  }

  async batchForceLogout(tokenIds: string[]) {
    for (const tokenId of tokenIds) {
      await this.forceLogout(tokenId);
    }
    return { code: 200, msg: '操作成功' };
  }
}
