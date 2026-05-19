import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('系统监控 / 数据监控')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/data')
export class DataController {
  @Get()
  @ApiOperation({ summary: '数据源监控信息' })
  getInfo() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        activeCount: 5,
        poolSize: 20,
        waitThreadCount: 0,
        dataSourceInfo: {
          url: 'jdbc:mysql://localhost:3306/ruoyi',
          username: 'root',
          driverClassName: 'com.mysql.cj.jdbc.Driver',
        },
      },
    };
  }
}
