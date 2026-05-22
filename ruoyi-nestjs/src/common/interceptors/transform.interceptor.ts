import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_TRANSFORM_KEY } from '../decorators/skip-transform.decorator';

export interface Response<T> {
  code: number;
  msg: string;
  data?: T;
  rows?: T[];
  total?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const skipTransform = Reflect.getMetadata(SKIP_TRANSFORM_KEY, context.getHandler());
    if (skipTransform) {
      return next.handle();
    }

    return next.handle().pipe(
      map((result) => {
        if (!result) return { code: 200, msg: '操作成功' };
        if ('code' in result) return result as Response<T>;
        return { code: 200, msg: '操作成功', data: result };
      }),
    );
  }
}
