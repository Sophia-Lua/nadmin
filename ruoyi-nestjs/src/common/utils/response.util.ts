import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ERROR_MESSAGES } from '../constants/error-code.constants';

export class RuoYiException extends HttpException {
  constructor(
    errorCode: ErrorCode = ErrorCode.FAIL,
    message?: string,
  ) {
    const defaultMessage = ERROR_MESSAGES[errorCode] || '操作失败';
    super(
      {
        code: errorCode,
        msg: message || defaultMessage,
      },
      HttpStatus.OK,
    );
  }

  static success(data?: any, msg = '操作成功') {
    return {
      code: ErrorCode.SUCCESS,
      msg,
      data,
    };
  }

  static fail(errorCode?: ErrorCode, msg?: string) {
    throw new RuoYiException(errorCode, msg);
  }

  static unauthorized(msg = '未授权') {
    throw new RuoYiException(ErrorCode.UNAUTHORIZED, msg);
  }

  static forbidden(msg = '禁止访问') {
    throw new RuoYiException(ErrorCode.FORBIDDEN, msg);
  }
}
