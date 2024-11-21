import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthorizeRoles = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
