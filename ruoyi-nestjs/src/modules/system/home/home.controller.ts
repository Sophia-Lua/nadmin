import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('系统首页')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system')
export class HomeController {
  @Get('home')
  @ApiOperation({ summary: '系统首页数据' })
  home() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        visitCount: 1234,
        userCount: 56,
        roleCount: 8,
        postCount: 12,
      },
    };
  }

  @Get('index')
  @ApiOperation({ summary: '系统首页' })
  index() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        visitCount: 1234,
        userCount: 56,
        roleCount: 8,
        postCount: 12,
      },
    };
  }

  @Get('main')
  @ApiOperation({ summary: '系统主页数据' })
  main() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        dynamicList: [
          { title: '系统初始化完成', type: 'success', time: '2024-01-01 10:00' },
          { title: '用户登录', type: 'info', time: '2024-01-01 09:30' },
        ],
        noticeList: [],
      },
    };
  }

  @Get('index/statistics')
  @ApiOperation({ summary: '首页统计数据' })
  statistics() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        visitCount: { total: 1234, month: 567, week: 123 },
        userCount: { total: 56, active: 45 },
        roleCount: 8,
        postCount: 12,
      },
    };
  }

  @Get('index/dynamic')
  @ApiOperation({ summary: '首页动态' })
  dynamic() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        dynamicList: [
          { title: '系统初始化完成', type: 'success', time: '2024-01-01 10:00' },
          { title: '用户登录', type: 'info', time: '2024-01-01 09:30' },
        ],
      },
    };
  }

  @Get('index/notice')
  @ApiOperation({ summary: '首页公告' })
  notice() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        noticeList: [
          { id: 1, title: '系统维护通知', type: 'announcement' },
          { id: 2, title: '版本更新公告', type: 'notice' },
        ],
      },
    };
  }

  @Get('main/data')
  @ApiOperation({ summary: '主页详细数据' })
  mainData() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        userActivity: [7, 12, 9, 15, 11, 8, 10],
        systemStatus: 'normal',
        lastUpdateTime: new Date().toISOString(),
      },
    };
  }
}
