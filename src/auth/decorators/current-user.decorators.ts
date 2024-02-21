import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthRequest } from '../models/AuthRequest';

export const CurrentUser = createParamDecorator(
  (data: unknown, execution: ExecutionContext): User => {
    const request = execution.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
