import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha.service';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';
import { CaptchaVo } from './vo/captcha.vo';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { RuoYiResponse } from '@/common/interfaces/response.interface';

@ApiTags('认证管理')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Get('captchaImage')
  @ApiOperation({ summary: '获取验证码图片' })
  @ApiOkResponse({ type: CaptchaVo })
  async getCaptcha(): Promise<RuoYiResponse<CaptchaVo>> {
    const captcha = await this.captchaService.generateCaptcha();
    return {
      code: 200,
      msg: '操作成功',
      ...captcha,
    };
  }

  @Get('login')
  @ApiOperation({ summary: '登录页面' })
  loginPage() {
    return { code: 200, msg: '操作成功' };
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginVo })
  async login(@Body() loginDto: LoginDto): Promise<RuoYiResponse<LoginVo>> {
    const user = await this.authService.validateUser(loginDto);
    const result = await this.authService.login(user);

    return {
      code: 200,
      msg: '登录成功',
      ...result,
    };
  }

  @Get('register')
  @ApiOperation({ summary: '注册页面' })
  registerPage() {
    return { code: 200, msg: '操作成功' };
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: LoginDto })
  async register(@Body() dto: any): Promise<RuoYiResponse<void>> {
    return { code: 200, msg: '注册成功' };
  }

  @Get('unauth')
  @ApiOperation({ summary: '未授权跳转' })
  unauth() {
    return { code: 200, msg: '操作成功' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  async logout(@Request() req): Promise<RuoYiResponse<void>> {
    return {
      code: 200,
      msg: '退出成功',
    };
  }

  @Post('unlockscreen')
  @ApiOperation({ summary: '解锁屏幕' })
  async unlockscreen(@Body() dto: any): Promise<RuoYiResponse<void>> {
    return { code: 200, msg: '操作成功' };
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  async getInfo(@Request() req): Promise<RuoYiResponse<any>> {
    const user = req.user;
    return {
      code: 200,
      msg: '操作成功',
      data: {
        permissions: user.permissions,
        roles: user.roles,
        user: {
          userId: user.userId,
          loginName: user.loginName,
        },
      },
    };
  }
}
