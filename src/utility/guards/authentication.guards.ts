//Guard is a class that determine whether a given request will be handled by the route handler or not.
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.currentUser; // Check if the user exists
  }
}
