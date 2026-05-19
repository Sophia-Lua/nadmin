import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha.service';
import { SysUser } from '@/entities/sys-user.entity';
import { SysRole } from '@/entities/sys-role.entity';
import { SysMenu } from '@/entities/sys-menu.entity';
import { JwtStrategy } from '@/common/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRES_IN') || 7200,
        },
      }),
    }),
    TypeOrmModule.forFeature([SysUser, SysRole, SysMenu]),
  ],
  controllers: [AuthController],
  providers: [AuthService, CaptchaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
