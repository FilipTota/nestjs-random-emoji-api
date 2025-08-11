import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Guard: checking authentication');
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    console.log('apiKey', apiKey);
    if (apiKey !== 'SECRET') {
      console.log('Guard: authentication failed');
      return false;
    }
    console.log('Guard: authentication successful');
    return true;
  }
}
