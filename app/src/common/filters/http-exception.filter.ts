import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the error message from the exception
    const exceptionResponse: any = exception instanceof HttpException 
      ? exception.getResponse() 
      : 'Internal server error';

    const message = typeof exceptionResponse === 'object' 
      ? exceptionResponse.message || exceptionResponse.error 
      : exceptionResponse;

    // Standardized Error Response
    response.status(status).json({
      success: false,
      data: null,
      message: Array.isArray(message) ? message.join(', ') : message,
    });
  }
}