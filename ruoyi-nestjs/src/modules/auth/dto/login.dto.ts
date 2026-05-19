import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(2, { message: '用户名至少 2 个字符' })
  @MaxLength(30, { message: '用户名最多 30 个字符' })
  username: string;

  @ApiProperty({ description: '密码', example: 'admin123' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(5, { message: '密码至少 5 个字符' })
  @MaxLength(20, { message: '密码最多 20 个字符' })
  password: string;

  @ApiProperty({ description: '验证码', required: false, example: '1234' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: '验证码 UUID', required: false })
  @IsOptional()
  @IsString()
  uuid?: string;
}
