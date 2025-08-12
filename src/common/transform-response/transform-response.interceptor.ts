import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`Interceptor: transforming response`);
    return next.handle().pipe(
      map((data) => {
        console.log(`Interceptor: transforming response`);
        return { data: data as object };
      }),
    );
  }
}
