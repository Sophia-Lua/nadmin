import { Controller, Get, Post, Delete, Query, Param, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { JobLogService } from './job-log.service';

@ApiTags('系统监控 / 任务日志')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/job-log')
export class JobLogController {
  constructor(private readonly jobLogService: JobLogService) {}

  @Get('list')
  @ApiOperation({ summary: '任务日志列表' })
  list(
    @Query('pageNum') pageNum: number,
    @Query('pageSize') pageSize: number,
    @Query('jobName') jobName?: string,
    @Query('jobGroup') jobGroup?: string,
    @Query('status') status?: string,
  ) {
    return this.jobLogService.list(pageNum || 1, pageSize || 10, jobName, jobGroup, status);
  }

  @Get(':jobLogId')
  @ApiOperation({ summary: '任务日志详情' })
  detail(@Param('jobLogId') jobLogId: string) {
    return this.jobLogService.detail(Number(jobLogId));
  }

  @Delete(':logIds')
  @ApiOperation({ summary: '删除任务日志' })
  remove(@Param('logIds') logIds: string) {
    return this.jobLogService.remove(logIds);
  }

  @Delete('clean')
  @ApiOperation({ summary: '清空任务日志' })
  clean() {
    return this.jobLogService.clean();
  }

  @Post('export')
  @ApiOperation({ summary: '任务日志导出' })
  export(@Body() dto: any) {
    return this.jobLogService.export(dto);
  }
}
