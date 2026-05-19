import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUser } from '../../../entities/sys-user.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysUser])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
