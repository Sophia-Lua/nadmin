import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysJobLog } from '../../../entities/sys-job-log.entity';
import { JobLogService } from './job-log.service';
import { JobLogController } from './job-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SysJobLog])],
  controllers: [JobLogController],
  providers: [JobLogService],
})
export class JobLogModule {}
