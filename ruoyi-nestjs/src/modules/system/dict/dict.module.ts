import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDictType } from '../../../entities/sys-dict-type.entity';
import { SysDictData } from '../../../entities/sys-dict-data.entity';
import { DictController } from './dict.controller';
import { DictService } from './dict.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysDictType, SysDictData])],
  controllers: [DictController],
  providers: [DictService],
  exports: [DictService],
})
export class DictModule {}
