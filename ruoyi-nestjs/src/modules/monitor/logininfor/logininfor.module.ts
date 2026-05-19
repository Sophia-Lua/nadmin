import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysLogininfor } from '../../../entities/sys-logininfor.entity';
import { LogininforController } from './logininfor.controller';
import { LogininforService } from './logininfor.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysLogininfor])],
  controllers: [LogininforController],
  providers: [LogininforService],
})
export class LogininforModule {}
