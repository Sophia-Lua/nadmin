import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { LogininforService } from './logininfor.service';

@ApiTags('系统监控 / 登录日志')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/logininfor')
export class LogininforController {
  constructor(private readonly logininforService: LogininforService) {}

  @Get('list')
  @ApiOperation({ summary: '登录日志列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('ipaddr') ipaddr?: string, @Query('userName') userName?: string, @Query('status') status?: string) {
    return this.logininforService.list(pageNum || 1, pageSize || 10, ipaddr, userName, status);
  }

  @Get(':infoId')
  @ApiOperation({ summary: '登录日志详情' })
  detail(@Param('infoId') infoId: string) {
    return this.logininforService.detail(Number(infoId));
  }

  @Delete('clean')
  @ApiOperation({ summary: '清空登录日志' })
  clean() {
    return this.logininforService.clean();
  }

  @Delete(':infoIds')
  @ApiOperation({ summary: '删除登录日志' })
  remove(@Param('infoIds') infoIds: string) {
    return this.logininforService.remove(infoIds);
  }

  @Get('unlock/:loginName')
  @ApiOperation({ summary: '解锁' })
  unlock(@Param('loginName') loginName: string) {
    return this.logininforService.unlock(loginName);
  }

  @Post('export')
  @ApiOperation({ summary: '登录日志导出' })
  export(@Body() dto: any) {
    return this.logininforService.export(dto);
  }
}
