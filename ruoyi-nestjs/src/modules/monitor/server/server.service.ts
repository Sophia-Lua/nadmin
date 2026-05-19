import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class ServerService {
  async getInfo() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    return {
      code: 200,
      msg: '操作成功',
      data: {
        cpu: { cpuNum: os.cpus().length, used: 0, sys: 0, free: 0 },
        mem: { total: Math.round(totalMem / 1024 / 1024), used: Math.round((totalMem - freeMem) / 1024 / 1024), free: Math.round(freeMem / 1024 / 1024) },
        sys: { os: os.type(), arch: os.arch(), nodeVersion: process.version },
        sysFiles: [{ dirName: '/', typeName: os.type(), total: '0', free: '0', used: '0' }],
      },
    };
  }
}
