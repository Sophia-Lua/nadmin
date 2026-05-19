import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { NoticeService } from './notice.service';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';

@ApiTags('系统管理 / 通知公告')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  @ApiOperation({ summary: '通知公告管理页面' })
  index() {
    return { code: 200, msg: '操作成功' };
  }

  @Get('list')
  @ApiOperation({ summary: '公告列表' })
  list(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('noticeTitle') noticeTitle?: string, @Query('noticeType') noticeType?: string) {
    return this.noticeService.list(pageNum || 1, pageSize || 10, noticeTitle, noticeType);
  }

  @Post('list')
  @ApiOperation({ summary: '公告列表查询' })
  listPost(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('noticeTitle') noticeTitle?: string, @Query('noticeType') noticeType?: string) {
    return this.noticeService.list(pageNum || 1, pageSize || 10, noticeTitle, noticeType);
  }

  @Post('export')
  @ApiOperation({ summary: '公告导出' })
  export(@Body() dto: any) {
    return this.noticeService.export(dto);
  }

  @Get('add')
  @ApiOperation({ summary: '新增公告页面' })
  addPage() {
    return { code: 200, msg: '操作成功', data: {} };
  }

  @Get('edit/:noticeId')
  @ApiOperation({ summary: '修改公告页面' })
  editPage(@Param('noticeId') noticeId: string) {
    return this.noticeService.detail(Number(noticeId));
  }

  @Get(':noticeId')
  @ApiOperation({ summary: '公告详情' })
  detail(@Param('noticeId') noticeId: string) {
    return this.noticeService.detail(Number(noticeId));
  }

  @Post()
  @ApiOperation({ summary: '创建公告' })
  create(@Body() dto: CreateNoticeDto) {
    return this.noticeService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '修改公告' })
  update(@Body() dto: UpdateNoticeDto) {
    return this.noticeService.update(dto);
  }

  @Delete(':noticeIds')
  @ApiOperation({ summary: '删除公告' })
  remove(@Param('noticeIds') noticeIds: string) {
    return this.noticeService.remove(noticeIds);
  }

  @Get('view/:userId')
  @ApiOperation({ summary: '查看用户已读公告' })
  viewUserNotices(@Param('userId') userId: string) {
    return this.noticeService.viewUserNotices(Number(userId));
  }

  @Post('read/:noticeId')
  @ApiOperation({ summary: '标记公告已读' })
  markAsRead(@Param('noticeId') noticeId: string, @Body() body: { userId: number }) {
    return this.noticeService.markAsRead(Number(noticeId), body.userId);
  }

  @Post('batchRead')
  @ApiOperation({ summary: '批量标记已读' })
  batchRead(@Body() body: { noticeIds: string, userId: number }) {
    return this.noticeService.batchRead(body.noticeIds, body.userId);
  }
}
