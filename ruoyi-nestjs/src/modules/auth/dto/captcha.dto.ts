import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CaptchaDto {
  @ApiProperty({ description: '验证码类型', required: false, example: 'math' })
  @IsOptional()
  @IsString()
  type?: string;
}
