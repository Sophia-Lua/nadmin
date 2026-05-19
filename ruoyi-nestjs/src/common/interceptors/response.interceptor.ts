import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RuoYiResponse<T> {
  code: number;
  msg: string;
  data?: T;
  rows?: T[];
  total?: number;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, RuoYiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<RuoYiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: RuoYiResponse<T> = {
          code: HttpStatus.OK,
          msg: '操作成功',
        };

        if (data === null || data === undefined) {
          return response;
        }

        if (typeof data === 'object') {
          if (Array.isArray(data['rows']) && 'total' in data) {
            response.rows = data['rows'];
            response.total = data['total'];
          } else {
            response.data = data;
          }
        } else {
          response.data = data;
        }

        return response;
      }),
    );
  }
}
