import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { OperlogService } from './operlog.service';

@ApiTags('系统监控 / 操作日志')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/operlog')
export class OperlogController {
  constructor(private readonly operlogService: OperlogService) {}

  @Get('list')
  @ApiOperation({ summary: '操作日志列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('title') title?: string, @Query('operName') operName?: string) {
    return this.operlogService.list(pageNum || 1, pageSize || 10, title, operName);
  }

  @Get(':infoId')
  @ApiOperation({ summary: '操作日志详情' })
  detail(@Param('infoId') infoId: string) {
    return this.operlogService.detail(Number(infoId));
  }

  @Delete('clean')
  @ApiOperation({ summary: '清空操作日志' })
  clean() {
    return this.operlogService.clean();
  }

  @Delete(':infoIds')
  @ApiOperation({ summary: '删除操作日志' })
  remove(@Param('infoIds') infoIds: string) {
    return this.operlogService.remove(infoIds);
  }

  @Post('export')
  @ApiOperation({ summary: '操作日志导出' })
  export(@Body() dto: any) {
    return this.operlogService.export(dto);
  }
}
