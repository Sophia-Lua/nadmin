import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码', example: 'test123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '确认密码', example: 'test123456' })
  @IsString()
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '手机号码', required: false })
  @IsString()
  @IsOptional()
  phonenumber?: string;

  @ApiProperty({ description: '验证码', required: false })
  @IsString()
  @IsOptional()
  code?: string;
}
