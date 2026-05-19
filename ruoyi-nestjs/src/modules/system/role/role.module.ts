import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysRole } from '../../../entities/sys-role.entity';
import { SysMenu } from '../../../entities/sys-menu.entity';
import { SysDept } from '../../../entities/sys-dept.entity';
import { SysUser } from '../../../entities/sys-user.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysRole, SysMenu, SysDept, SysUser]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
