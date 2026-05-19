import { Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GenService } from './gen.service';

@ApiTags('系统工具 / 代码生成')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tool/gen')
export class GenController {
  constructor(private readonly genService: GenService) {}

  @Get()
  @ApiOperation({ summary: '代码生成管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '表列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('tableName') tableName?: string) {
    return this.genService.list(pageNum || 1, pageSize || 10, tableName);
  }

  @Post('list')
  @ApiOperation({ summary: '表列表查询' })
  listPost(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('tableName') tableName?: string) {
    return this.genService.list(pageNum || 1, pageSize || 10, tableName);
  }

  @Get('edit/:tableId')
  @ApiOperation({ summary: '修改表配置页面' })
  editPage(@Param('tableId') tableId: string) {
    return this.genService.detail(Number(tableId));
  }

  @Post('synchDb')
  @ApiOperation({ summary: '同步数据库' })
  synchDb(@Query('tableName') tableName: string) {
    return { code: 200, msg: '操作成功' };
  }

  @Post('edit')
  @ApiOperation({ summary: '修改表配置' })
  updatePost(@Body() dto: any) {
    return this.genService.update(dto);
  }

  @Get('db/list')
  @ApiOperation({ summary: '数据库表列表' })
  dbList(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('tableName') tableName?: string) {
    return this.genService.dbList(pageNum || 1, pageSize || 10, tableName);
  }

  @Get(':tableId')
  @ApiOperation({ summary: '表详情' })
  detail(@Param('tableId') tableId: string) {
    return this.genService.detail(Number(tableId));
  }

  @Post('importTable')
  @ApiOperation({ summary: '导入表' })
  importTable(@Query('tables') tables: string) {
    return this.genService.importTable(tables);
  }

  @Delete(':tableIds')
  @ApiOperation({ summary: '删除表' })
  remove(@Param('tableIds') tableIds: string) {
    return this.genService.remove(tableIds);
  }

  @Put()
  @ApiOperation({ summary: '修改表配置' })
  update() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('preview/:tableId')
  @ApiOperation({ summary: '预览代码' })
  preview(@Param('tableId') tableId: string) {
    return this.genService.preview(Number(tableId));
  }

  @Get('download/:tableName')
  @ApiOperation({ summary: '生成下载' })
  download(@Param('tableName') tableName: string) {
    return this.genService.download(tableName);
  }

  @Get('genCode/:tableName')
  @ApiOperation({ summary: '生成代码到本地' })
  genCode(@Param('tableName') tableName: string) {
    return this.genService.genCode(tableName);
  }
}
