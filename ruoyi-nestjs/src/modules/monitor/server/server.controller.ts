import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ServerService } from './server.service';

@ApiTags('系统监控 / 服务监控')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  @ApiOperation({ summary: '获取服务器信息' })
  getInfo() {
    return this.serverService.getInfo();
  }
}
