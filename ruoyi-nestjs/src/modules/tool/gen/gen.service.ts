import { Injectable } from '@nestjs/common';

@Injectable()
export class GenService {
  async list(pageNum: number, pageSize: number, tableName?: string) {
    return { code: 200, msg: '操作成功', rows: [], total: 0 };
  }

  async dbList(pageNum: number, pageSize: number, tableName?: string) {
    return { code: 200, msg: '操作成功', rows: [], total: 0 };
  }

  async detail(tableId: number) {
    return { code: 200, msg: '操作成功', data: {} };
  }

  async importTable(tables: string) {
    return { code: 200, msg: '操作成功' };
  }

  async remove(tableIds: string) {
    return { code: 200, msg: '操作成功' };
  }

  async preview(tableId: number) {
    return { code: 200, msg: '操作成功', data: {} };
  }

  async download(tableName: string) {
    return { code: 200, msg: '操作成功', data: {} };
  }

  async genCode(tableName: string) {
    return { code: 200, msg: '操作成功' };
  }

  async update(dto: any) {
    return { code: 200, msg: '操作成功' };
  }
}
