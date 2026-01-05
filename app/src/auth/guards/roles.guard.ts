import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Retrieve the required roles from the handler or class metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user object attached to the request (inserted by JwtStrategy)
    const { user } = context.switchToHttp().getRequest();
    
    // 4. Validate if the user exists and matches one of the required roles
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied: Insufficient permissions.');
    }

    return true;
  }
}