import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { SysDictType } from '../../../entities/sys-dict-type.entity';
import { SysDictData } from '../../../entities/sys-dict-data.entity';
import { CreateDictTypeDto, UpdateDictTypeDto, CreateDictDataDto, UpdateDictDataDto } from './dto/dict.dto';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(SysDictType)
    private readonly sysDictTypeRepo: Repository<SysDictType>,
    @InjectRepository(SysDictData)
    private readonly sysDictDataRepo: Repository<SysDictData>,
  ) {}

  async typeList(pageNum: number, pageSize: number, dictName?: string) {
    const where: any = {};
    if (dictName) where.dictName = Like(`%${dictName}%`);
    const [rows, total] = await this.sysDictTypeRepo.findAndCount({ where, skip: (pageNum - 1) * pageSize, take: pageSize });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async typeDetail(dictId: number) {
    const type = await this.sysDictTypeRepo.findOne({ where: { dictId: String(dictId) } });
    if (!type) throw new NotFoundException('字典类型不存在');
    return { code: 200, msg: '操作成功', data: type };
  }

  async createType(dto: CreateDictTypeDto) {
    const type = this.sysDictTypeRepo.create({ ...dto, status: dto.status || '0' });
    await this.sysDictTypeRepo.save(type);
    return { code: 200, msg: '操作成功' };
  }

  async updateType(dto: UpdateDictTypeDto) {
    const type = await this.sysDictTypeRepo.findOne({ where: { dictId: String(dto.dictId) } });
    if (!type) throw new NotFoundException('字典类型不存在');
    Object.assign(type, dto);
    await this.sysDictTypeRepo.save(type);
    return { code: 200, msg: '操作成功' };
  }

  async removeType(dictIds: string) {
    await this.sysDictTypeRepo.delete({ dictId: In(dictIds.split(',')) });
    return { code: 200, msg: '操作成功' };
  }

  async dataList(dictType: string) {
    const data = await this.sysDictDataRepo.find({
      where: { dictType, status: '0' },
      order: { dictSort: 'ASC' },
    });
    return { code: 200, msg: '操作成功', data };
  }

  async createData(dto: CreateDictDataDto) {
    const data = this.sysDictDataRepo.create({ ...dto, status: dto.status || '0', dictSort: dto.dictSort || 0 });
    await this.sysDictDataRepo.save(data);
    return { code: 200, msg: '操作成功' };
  }

  async updateData(dto: UpdateDictDataDto) {
    const data = await this.sysDictDataRepo.findOne({ where: { dictCode: String(dto.dictCode) } });
    if (!data) throw new NotFoundException('字典数据不存在');
    Object.assign(data, dto);
    await this.sysDictDataRepo.save(data);
    return { code: 200, msg: '操作成功' };
  }

  async removeData(dictCodes: string) {
    await this.sysDictDataRepo.delete({ dictCode: In(dictCodes.split(',')) });
    return { code: 200, msg: '操作成功' };
  }

  async dataListPage(pageNum: number, pageSize: number, dictType?: string, dictLabel?: string) {
    const where: any = {};
    if (dictType) where.dictType = dictType;
    if (dictLabel) where.dictLabel = Like(`%${dictLabel}%`);
    const [rows, total] = await this.sysDictDataRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { dictSort: 'ASC' },
    });
    return { code: 200, msg: '操作成功', rows, total };
  }

  async dataDetail(dictCode: string) {
    const data = await this.sysDictDataRepo.findOne({ where: { dictCode } });
    if (!data) throw new NotFoundException('字典数据不存在');
    return { code: 200, msg: '操作成功', data };
  }

  async refreshCache() {
    return { code: 200, msg: '操作成功' };
  }

  async typeExport(dto: any) {
    const types = await this.sysDictTypeRepo.find({ order: { dictId: 'ASC' } });
    return { code: 200, msg: '操作成功', data: { types } };
  }

  async checkDictNameUnique(dto: any) {
    const { dictName } = dto;
    const type = await this.sysDictTypeRepo.findOne({ where: { dictName } });
    return { code: 200, msg: '操作成功', data: type ? { hasType: true } : { hasType: false } };
  }

  async checkDictTypeUnique(dto: any) {
    const { dictType } = dto;
    const type = await this.sysDictTypeRepo.findOne({ where: { dictType } });
    return { code: 200, msg: '操作成功', data: type ? { hasType: true } : { hasType: false } };
  }

  async checkDictLabelUnique(dto: any) {
    const { dictLabel, dictType } = dto;
    const data = await this.sysDictDataRepo.findOne({ where: { dictLabel, dictType } });
    return { code: 200, msg: '操作成功', data: data ? { hasData: true } : { hasData: false } };
  }
}
