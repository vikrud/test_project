import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomError, customErrors } from '../../../../messages/errors';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const jsonResponce = {
      success: false,
      error: null,
    };

    if (exception instanceof CustomError) {
      jsonResponce.error = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      jsonResponce.error = customErrors.UNAUTHORISED.message;
    } else if (
      exception instanceof QueryFailedError &&
      /^ER_DUP_ENTRY:/.test(exception.message)
    ) {
      jsonResponce.error = customErrors.EMAIL_OR_PHONE_ALREADY_IN_USE.message;
      status = HttpStatus.BAD_REQUEST;
    } else {
      jsonResponce.error = HttpStatus[500];
    }

    response.status(status).json(jsonResponce);
  }
}
