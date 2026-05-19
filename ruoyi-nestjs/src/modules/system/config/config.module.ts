import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysConfig } from '../../../entities/sys-config.entity';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysConfig])],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SysConfigModule {}
