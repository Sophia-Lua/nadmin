import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUser } from '../../../entities/sys-user.entity';
import { SysRole } from '../../../entities/sys-role.entity';
import { SysPost } from '../../../entities/sys-post.entity';
import { SysDept } from '../../../entities/sys-dept.entity';
import { SysUserController } from './sys-user.controller';
import { SysUserService } from './sys-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysUser, SysRole, SysPost, SysDept]),
  ],
  controllers: [SysUserController],
  providers: [SysUserService],
  exports: [SysUserService],
})
export class SysUserModule {}
