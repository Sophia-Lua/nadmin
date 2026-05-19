import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysJob } from '../../../entities/sys-job.entity';
import { SysJobLog } from '../../../entities/sys-job-log.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysJob, SysJobLog])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
