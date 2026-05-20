import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { MonitorCacheService } from './monitor-cache.service';

@ApiTags('系统监控 / 缓存监控')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/cache')
export class MonitorCacheController {
  constructor(private readonly cacheService: MonitorCacheService) {}

  @Get()
  @ApiOperation({ summary: '缓存信息' })
  getInfo() {
    return this.cacheService.getInfo();
  }

  @Get('getNames')
  @ApiOperation({ summary: '缓存列表' })
  getNames() {
    return this.cacheService.getNames();
  }

  @Get('getKeys/:cacheName')
  @ApiOperation({ summary: '缓存键列表' })
  getKeys(@Param('cacheName') cacheName: string) {
    return this.cacheService.getKeys(cacheName);
  }

  @Get('getValue/:cacheName/:cacheKey')
  @ApiOperation({ summary: '缓存值' })
  getValue(@Param('cacheName') cacheName: string, @Param('cacheKey') cacheKey: string) {
    return this.cacheService.getValue(cacheName, cacheKey);
  }

  @Delete('clearCacheName/:cacheName')
  @ApiOperation({ summary: '清理缓存' })
  clearCache(@Param('cacheName') cacheName: string) {
    return this.cacheService.clearCache(cacheName);
  }

  @Delete('clearCacheAll')
  @ApiOperation({ summary: '清理全部缓存' })
  clearCacheAll() {
    return this.cacheService.clearCacheAll();
  }

  @Get('monitor')
  @ApiOperation({ summary: '缓存监控详情' })
  monitor() {
    return this.cacheService.monitor();
  }
}
