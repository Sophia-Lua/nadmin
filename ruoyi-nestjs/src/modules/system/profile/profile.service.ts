import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUser } from '../../../entities/sys-user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(SysUser)
    private readonly sysUserRepo: Repository<SysUser>,
  ) {}

  async getProfile() {
    return { code: 200, msg: '操作成功', data: {} };
  }

  async updateProfile(dto: { userName: string; phonenumber: string; email: string; sex: string }) {
    return { code: 200, msg: '操作成功' };
  }

  async updatePassword(dto: { oldPassword: string; newPassword: string }) {
    return { code: 200, msg: '操作成功' };
  }

  async updateAvatar(avatar: string) {
    return { code: 200, msg: '操作成功' };
  }
}
