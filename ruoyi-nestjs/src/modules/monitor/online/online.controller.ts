import { Controller, Get, Delete, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { OnlineService } from './online.service';

@ApiTags('系统监控 / 在线用户')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitor/online')
export class OnlineController {
  constructor(private readonly onlineService: OnlineService) {}

  @Get('list')
  @ApiOperation({ summary: '在线用户列表' })
  list(@Query('ipaddr') ipaddr?: string, @Query('userName') userName?: string) {
    return this.onlineService.list(ipaddr, userName);
  }

  @Delete(':tokenId')
  @ApiOperation({ summary: '强退' })
  forceLogout(@Param('tokenId') tokenId: string) {
    return this.onlineService.forceLogout(tokenId);
  }

  @Delete('batchForceLogout')
  @ApiOperation({ summary: '批量强退' })
  batchForceLogout(@Body() body: { tokenIds: string[] }) {
    return this.onlineService.batchForceLogout(body.tokenIds);
  }
}
