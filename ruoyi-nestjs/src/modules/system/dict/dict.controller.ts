import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { DictService } from './dict.service';
import { CreateDictTypeDto, UpdateDictTypeDto, CreateDictDataDto, UpdateDictDataDto } from './dto/dict.dto';

@ApiTags('系统管理 / 字典管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Get('list')
  @ApiOperation({ summary: '字典列表' })
  list() {
    return this.dictService.typeList(1, 10, '');
  }

  @Get('type/list')
  @ApiOperation({ summary: '字典类型列表' })
  typeList(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('dictName') dictName?: string) {
    return this.dictService.typeList(pageNum || 1, pageSize || 10, dictName);
  }

  @Get('type')
  @ApiOperation({ summary: '字典管理页面' })
  typeIndex() {
    return { code: 200, msg: '操作成功' };
  }

  @Post('type/list')
  @ApiOperation({ summary: '字典类型列表查询' })
  typeListPost(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('dictName') dictName?: string) {
    return this.dictService.typeList(pageNum || 1, pageSize || 10, dictName);
  }

  @Post('type/export')
  @ApiOperation({ summary: '字典类型导出' })
  typeExport(@Body() dto: any) {
    return this.dictService.typeExport(dto);
  }

  @Get('type/:dictId')
  @ApiOperation({ summary: '字典类型详情' })
  typeDetail(@Param('dictId') dictId: string) {
    return this.dictService.typeDetail(Number(dictId));
  }

  @Post('type')
  @ApiOperation({ summary: '创建字典类型' })
  createType(@Body() dto: CreateDictTypeDto) {
    return this.dictService.createType(dto);
  }

  @Put('type')
  @ApiOperation({ summary: '修改字典类型' })
  updateType(@Body() dto: UpdateDictTypeDto) {
    return this.dictService.updateType(dto);
  }

  @Delete('type/:dictIds')
  @ApiOperation({ summary: '删除字典类型' })
  removeType(@Param('dictIds') dictIds: string) {
    return this.dictService.removeType(dictIds);
  }

  @Get('data/list')
  @ApiOperation({ summary: '字典数据列表 (分页)' })
  dataListPage(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('dictType') dictType?: string, @Query('dictLabel') dictLabel?: string) {
    return this.dictService.dataListPage(pageNum || 1, pageSize || 10, dictType, dictLabel);
  }

  @Get('data/type/:dictType')
  @ApiOperation({ summary: '字典数据列表' })
  dataList(@Param('dictType') dictType: string) {
    return this.dictService.dataList(dictType);
  }

  @Get('data/:dictCode')
  @ApiOperation({ summary: '字典数据详情' })
  dataDetail(@Param('dictCode') dictCode: string) {
    return this.dictService.dataDetail(dictCode);
  }

  @Post('data')
  @ApiOperation({ summary: '创建字典数据' })
  createData(@Body() dto: CreateDictDataDto) {
    return this.dictService.createData(dto);
  }

  @Put('data')
  @ApiOperation({ summary: '修改字典数据' })
  updateData(@Body() dto: UpdateDictDataDto) {
    return this.dictService.updateData(dto);
  }

  @Delete('data/:dictCodes')
  @ApiOperation({ summary: '删除字典数据' })
  removeData(@Param('dictCodes') dictCodes: string) {
    return this.dictService.removeData(dictCodes);
  }

  @Delete('type/refreshCache')
  @ApiOperation({ summary: '刷新字典缓存' })
  refreshCache() {
    return this.dictService.refreshCache();
  }

  @Post('type/checkDictNameUnique')
  @ApiOperation({ summary: '检查字典类型名称唯一性' })
  checkDictNameUnique(@Body() dto: any) {
    return this.dictService.checkDictNameUnique(dto);
  }

  @Post('type/checkDictTypeUnique')
  @ApiOperation({ summary: '检查字典类型唯一性' })
  checkDictTypeUnique(@Body() dto: any) {
    return this.dictService.checkDictTypeUnique(dto);
  }

  @Post('data/checkDictLabelUnique')
  @ApiOperation({ summary: '检查字典数据标签唯一性' })
  checkDictLabelUnique(@Body() dto: any) {
    return this.dictService.checkDictLabelUnique(dto);
  }
}
