import { ApiProperty } from '@nestjs/swagger';

export class LoginVo {
  @ApiProperty({ description: '访问令牌' })
  token: string;

  @ApiProperty({ description: '过期时间 (秒)' })
  expiresIn: number;

  @ApiProperty({ description: '用户信息' })
  user: {
    userId: string;
    loginName: string;
    userName: string;
    avatar: string;
  };
}
