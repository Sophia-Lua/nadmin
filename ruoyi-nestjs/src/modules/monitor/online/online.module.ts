import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUserOnline } from '../../../entities/sys-user-online.entity';
import { OnlineController } from './online.controller';
import { OnlineService } from './online.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysUserOnline])],
  controllers: [OnlineController],
  providers: [OnlineService],
})
export class OnlineModule {}
