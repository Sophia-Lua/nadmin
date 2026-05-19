import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ConfigService } from './config.service';
import { CreateConfigDto, UpdateConfigDto } from './dto/config.dto';

@ApiTags('系统管理 / 参数管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: '参数管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '参数列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('configName') configName?: string, @Query('configKey') configKey?: string) {
    return this.configService.list(pageNum || 1, pageSize || 10, configName, configKey);
  }

  @Post('list')
  @ApiOperation({ summary: '参数列表查询' })
  listPost(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('configName') configName?: string, @Query('configKey') configKey?: string) {
    return this.configService.list(pageNum || 1, pageSize || 10, configName, configKey);
  }

  @Post('export')
  @ApiOperation({ summary: '参数导出' })
  export(@Body() dto: any) {
    return this.configService.export(dto);
  }

  @Post('refreshCache')
  @ApiOperation({ summary: '刷新参数缓存' })
  refreshCache() {
    return this.configService.refreshCache();
  }

  @Get(':configId')
  @ApiOperation({ summary: '参数详情' })
  detail(@Param('configId') configId: string) {
    return this.configService.detail(Number(configId));
  }

  @Get('configKey/:configKey')
  @ApiOperation({ summary: '根据键名查询' })
  getByKey(@Param('configKey') configKey: string) {
    return this.configService.getByKey(configKey);
  }

  @Post()
  @ApiOperation({ summary: '创建参数' })
  create(@Body() dto: CreateConfigDto) {
    return this.configService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改参数' })
  update(@Body() dto: UpdateConfigDto) {
    return this.configService.update(dto);
  }

  @Delete(':configIds')
  @ApiOperation({ summary: '删除参数' })
  remove(@Param('configIds') configIds: string) {
    return this.configService.remove(configIds);
  }
}
