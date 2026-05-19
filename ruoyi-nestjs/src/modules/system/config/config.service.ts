import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysConfig } from '../../../entities/sys-config.entity';
import { CreateConfigDto, UpdateConfigDto } from './dto/config.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(SysConfig)
    private readonly sysConfigRepo: Repository<SysConfig>,
  ) {}

  async list(pageNum: number, pageSize: number, configName?: string, configKey?: string) {
    const where: any = {};
    if (configName) where.configName = Like(`%${configName}%`);
    if (configKey) where.configKey = Like(`%${configKey}%`);
    const [rows, total] = await this.sysConfigRepo.findAndCount({ where, skip: (pageNum - 1) * pageSize, take: pageSize });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async detail(configId: number) {
    const config = await this.sysConfigRepo.findOne({ where: { configId: String(configId) } });
    if (!config) throw new NotFoundException('参数不存在');
    return { code: 200, msg: '操作成功', data: config };
  }

  async getByKey(configKey: string) {
    const config = await this.sysConfigRepo.findOne({ where: { configKey } });
    if (!config) throw new NotFoundException('参数不存在');
    return { code: 200, msg: '操作成功', data: config.configValue };
  }

  async create(dto: CreateConfigDto) {
    const config = this.sysConfigRepo.create({ ...dto, configType: dto.configType || 'N' });
    await this.sysConfigRepo.save(config);
    return { code: 200, msg: '操作成功' };
  }

  async update(dto: UpdateConfigDto) {
    const config = await this.sysConfigRepo.findOne({ where: { configId: String(dto.configId) } });
    if (!config) throw new NotFoundException('参数不存在');
    Object.assign(config, dto);
    await this.sysConfigRepo.save(config);
    return { code: 200, msg: '操作成功' };
  }

  async remove(configIds: string) {
    await this.sysConfigRepo.delete({ configId: In(configIds.split(',')) });
    return { code: 200, msg: '操作成功' };
  }

  async export(dto: any) {
    const configs = await this.sysConfigRepo.find({ order: { configId: 'ASC' } });
    return { code: 200, msg: '操作成功', data: { configs } };
  }

  async refreshCache() {
    return { code: 200, msg: '操作成功' };
  }
}
