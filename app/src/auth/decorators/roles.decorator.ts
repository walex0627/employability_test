import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Key used to store metadata for roles.
 */
export const ROLES_KEY = 'roles';

/**
 * Custom decorator to enforce Role-Based Access Control (RBAC).
 * @param roles - List of allowed UserRoles (e.g., ADMIN, GESTOR).
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);