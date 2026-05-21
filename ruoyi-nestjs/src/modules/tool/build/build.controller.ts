import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('系统工具 / 表单构建')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tool/build')
export class BuildController {
  @Get('list')
  @ApiOperation({ summary: '表单构建列表' })
  list() {
    return { code: 200, msg: '操作成功', data: { msg: '表单构建功能' } };
  }

  @Get()
  @ApiOperation({ summary: '表单构建页面' })
  build() {
    return { code: 200, msg: '操作成功', data: { msg: '表单构建功能' } };
  }
}
