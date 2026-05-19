import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { JobService } from './job.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@ApiTags('系统监控 / 定时任务')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('list')
  @ApiOperation({ summary: '任务列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('jobName') jobName?: string) {
    return this.jobService.list(pageNum || 1, pageSize || 10, jobName);
  }

  @Get(':jobId')
  @ApiOperation({ summary: '任务详情' })
  detail(@Param('jobId') jobId: string) {
    return this.jobService.detail(Number(jobId));
  }

  @Post()
  @ApiOperation({ summary: '创建任务' })
  create(@Body() dto: CreateJobDto) {
    return this.jobService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改任务' })
  update(@Body() dto: UpdateJobDto) {
    return this.jobService.update(dto);
  }

  @Delete(':jobIds')
  @ApiOperation({ summary: '删除任务' })
  remove(@Param('jobIds') jobIds: string) {
    return this.jobService.remove(jobIds);
  }

  @Put('run/:jobId')
  @ApiOperation({ summary: '执行任务' })
  run(@Param('jobId') jobId: string) {
    return this.jobService.run(Number(jobId));
  }

  @Put('changeStatus')
  @ApiOperation({ summary: '任务状态修改' })
  changeStatus(@Body() dto: any) {
    return this.jobService.changeStatus(dto);
  }

  @Post('export')
  @ApiOperation({ summary: '任务导出' })
  export(@Body() dto: any) {
    return this.jobService.export(dto);
  }

  @Get('log/list')
  @ApiOperation({ summary: '任务日志列表' })
  logList(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('jobName') jobName?: string) {
    return this.jobService.logList(pageNum || 1, pageSize || 10, jobName);
  }

  @Delete('log/:logIds')
  @ApiOperation({ summary: '删除任务日志' })
  removeLog(@Param('logIds') logIds: string) {
    return this.jobService.removeLog(logIds);
  }

  @Delete('log/clean')
  @ApiOperation({ summary: '清空任务日志' })
  cleanLog() {
    return this.jobService.cleanLog();
  }
}
