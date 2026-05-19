import { SetMetadata } from '@nestjs/common';

export const REQUIRES_ROLES_KEY = 'requires_roles';

export const RequiresRoles = (...roles: string[]) =>
  SetMetadata(REQUIRES_ROLES_KEY, roles);
