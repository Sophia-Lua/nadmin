import { Module } from '@nestjs/common';
import { MonitorCacheController } from './monitor-cache.controller';
import { MonitorCacheService } from './monitor-cache.service';

@Module({
  controllers: [MonitorCacheController],
  providers: [MonitorCacheService],
})
export class MonitorCacheModule {}
