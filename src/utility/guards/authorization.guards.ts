import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export function AuthorizationGuard(allowedRoles: string[]) {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRoles = request?.currentUser?.roles || [];

      // Log user roles for debugging
      console.log('User roles:', userRoles);
      console.log('Allowed roles:', allowedRoles);

      const hasRole = userRoles.some((role: string) =>
        allowedRoles.includes(role),
      );

      if (hasRole) {
        return true;
      }

      throw new UnauthorizedException('Sorry, you are not authorized');
    }
  }

  return mixin(RolesGuardMixin);
}

/* This code defines a dynamic authorization guard in NestJS that checks if a user's roles match the allowed roles for accessing a particular route. */
