import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { customError } from 'messages/errors';
import { customErrors } from 'messages/errors';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let jsonResponce = {
      success: false,
      error: null,
    };

    if (exception instanceof customError) {
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
