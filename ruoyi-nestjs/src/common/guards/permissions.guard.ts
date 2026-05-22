import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { REQUIRES_PERMISSIONS_KEY } from '../decorators/requires-permissions.decorator';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRES_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 先执行 JWT 认证
    const jwtResult = await super.canActivate(context);
    if (!jwtResult) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // 超级管理员（admin角色）直接放行
    if (Array.isArray(user.roles) && user.roles.includes('admin')) {
      return true;
    }

    // 拥有所有权限标记的用户直接放行
    if (user.permissions && user.permissions.includes('*:*:*')) {
      return true;
    }

    if (!user.permissions || user.permissions.length === 0) {
      return false;
    }

    return requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );
  }
}
