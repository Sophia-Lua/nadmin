import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionHandler');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : { message: '内部服务器错误' };

    const msg = typeof message === 'string' ? message : (message as any).message || '操作失败';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Internal Server Error: ${request.method} ${request.url} - ${JSON.stringify(msg)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `HTTP Error ${status}: ${request.method} ${request.url} - ${JSON.stringify(msg)}`,
      );
    }

    response.status(status).json({
      code: status,
      msg: Array.isArray(msg) ? msg[0] : msg,
      data: null,
    });
  }
}
