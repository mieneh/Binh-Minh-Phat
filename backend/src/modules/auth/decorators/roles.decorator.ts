import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: Array<'admin' | 'employee'>) =>
  SetMetadata('roles', roles);
