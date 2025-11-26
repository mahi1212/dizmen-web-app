import { ApiResponse } from '../interfaces/response.interface';
import { HttpStatus } from '@nestjs/common';

export class ResponseUtil {
  static success<T>(
    message: string,
    data?: T,
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      status_code: statusCode,
    };
  }

  static error(
    message: string,
    error?: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ): ApiResponse {
    return {
      success: false,
      message,
      error,
      status_code: statusCode,
    };
  }

  static created<T>(
    message: string,
    data?: T,
  ): ApiResponse<T> {
    return this.success(message, data, HttpStatus.CREATED);
  }

  static notFound(message: string = 'Resource not found'): ApiResponse {
    return this.error(message, undefined, HttpStatus.NOT_FOUND);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiResponse {
    return this.error(message, undefined, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Forbidden'): ApiResponse {
    return this.error(message, undefined, HttpStatus.FORBIDDEN);
  }

  static internalError(
    message: string = 'Internal server error',
    error?: string,
  ): ApiResponse {
    return this.error(message, error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

