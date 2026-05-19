import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysOperLog } from '../../../entities/sys-oper-log.entity';
import { OperlogController } from './operlog.controller';
import { OperlogService } from './operlog.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysOperLog])],
  controllers: [OperlogController],
  providers: [OperlogService],
})
export class OperlogModule {}
