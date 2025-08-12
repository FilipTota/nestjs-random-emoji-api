import {
  CanActivate,
  ExecutionContext,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { LoggerService } from '../../logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // throw new Error('Error thrown in guard');
    // throw new UnauthorizedException();
    this.logger.info('Guard: checking authentication');
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    if (apiKey !== 'SECRET') {
      this.logger.info('Guard: authentication failed');
      return false;
    }
    this.logger.info('Guard: authentication successful');
    return true;
  }
}
