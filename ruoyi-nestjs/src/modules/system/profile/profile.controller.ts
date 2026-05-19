import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

@ApiTags('系统管理 / 个人中心')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: '个人中心页面' })
  profile() {
    return this.profileService.getProfile();
  }

  @Put()
  @ApiOperation({ summary: '修改个人信息' })
  update(@Body() dto: { userName: string; phonenumber: string; email: string; sex: string }) {
    return this.profileService.updateProfile(dto);
  }

  @Put('pwd')
  @ApiOperation({ summary: '修改密码' })
  updatePwd(@Body() dto: { oldPassword: string; newPassword: string }) {
    return this.profileService.updatePassword(dto);
  }

  @Post('avatar')
  @ApiOperation({ summary: '修改头像' })
  updateAvatar(@Body() dto: { avatar: string }) {
    return this.profileService.updateAvatar(dto.avatar);
  }
}
