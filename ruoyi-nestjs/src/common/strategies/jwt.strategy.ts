import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  loginName: string;
  permissions: string[];
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret || secret === 'default-secret') {
      throw new InternalServerErrorException(
        'JWT_SECRET environment variable is not configured properly',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    return {
      userId: payload.sub,
      loginName: payload.loginName,
      permissions: payload.permissions,
      roles: payload.roles,
    };
  }
}
