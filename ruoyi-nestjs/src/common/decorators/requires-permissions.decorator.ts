import { SetMetadata } from '@nestjs/common';

export const REQUIRES_PERMISSIONS_KEY = 'requires_permissions';

export const RequiresPermissions = (...permissions: string[]) =>
  SetMetadata(REQUIRES_PERMISSIONS_KEY, permissions);
