import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('系统工具 / 系统接口')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tool/swagger')
export class SwaggerController {
  @Get()
  @ApiOperation({ summary: '系统接口文档' })
  index() {
    return {
      code: 200,
      msg: '操作成功',
      data: {
        swaggerUrl: '/swagger-ui',
        jsonUrl: '/swagger-json',
      },
    };
  }
}
