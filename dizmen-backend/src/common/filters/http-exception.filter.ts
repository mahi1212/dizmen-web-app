import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let error: string | string[] | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || exception.message || 'An error occurred';
      error = Array.isArray(responseObj.message)
        ? responseObj.message.join(', ')
        : responseObj.message || responseObj.error;
    } else {
      message = exception.message || 'An error occurred';
    }

    const apiResponse: ApiResponse = {
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
      error: Array.isArray(error) ? error.join(', ') : error,
      status_code: status,
    };

    response.status(status).json(apiResponse);
  }
}

