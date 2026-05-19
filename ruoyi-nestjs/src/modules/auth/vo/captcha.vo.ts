import { ApiProperty } from '@nestjs/swagger';

export class CaptchaVo {
  @ApiProperty({ description: '是否启用验证码' })
  captchaEnabled: boolean;

  @ApiProperty({ description: '验证码 token' })
  token: string;

  @ApiProperty({ description: '验证码 UUID' })
  uuid: string;

  @ApiProperty({ description: '验证码图片 (base64)' })
  img: string;
}
