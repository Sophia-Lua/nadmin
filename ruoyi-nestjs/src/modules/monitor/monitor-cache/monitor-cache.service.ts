import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitorCacheService {
  async getInfo() {
    return { code: 200, msg: '操作成功', data: { commandStats: [], dbSize: 0, info: {} } };
  }

  async getNames() {
    return { code: 200, msg: '操作成功', data: [] };
  }

  async getKeys(cacheName: string) {
    return { code: 200, msg: '操作成功', data: { cacheName: '', keys: [] } };
  }

  async getValue(cacheName: string, cacheKey: string) {
    return { code: 200, msg: '操作成功', data: { cacheKey: '', cacheValue: '' } };
  }

  async clearCache(cacheName: string) {
    return { code: 200, msg: '操作成功' };
  }

  async clearCacheAll() {
    return { code: 200, msg: '操作成功' };
  }

  async monitor() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        commandStats: [
          { name: 'cmdstat_get', value: 'calls=100,usec=500' },
          { name: 'cmdstat_set', value: 'calls=50,usec=250' },
        ],
        dbSize: 1000,
        info: {
          redis_version: '7.0.0',
          uptime_in_days: '1',
          connected_clients: '10',
          used_memory: '10M',
          used_memory_peak: '15M',
        },
      },
    };
  }
}
