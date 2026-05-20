import { Module } from '@nestjs/common';
import { OperlogModule } from './operlog/operlog.module';
import { LogininforModule } from './logininfor/logininfor.module';
import { OnlineModule } from './online/online.module';
import { ServerModule } from './server/server.module';
import { MonitorCacheModule } from './monitor-cache/monitor-cache.module';
import { JobModule } from './job/job.module';
import { JobLogModule } from './job-log/job-log.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    OperlogModule,
    LogininforModule,
    OnlineModule,
    ServerModule,
    MonitorCacheModule,
    JobModule,
    JobLogModule,
    DataModule,
  ],
})
export class MonitorModule {}
