import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '@core/logger/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errorData = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        message = exceptionResponse['message'] || message;
        errorData = exceptionResponse['error'] || null;
      }
    } else {
      this.logger.err(
        `Unexpected Error: ${exception.message}`,
        'GlobalExceptionFilter',
      );
      message = exception.message || 'An unexpected error occurred';
    }

    response.status(status).json({
      status: false,
      code: status,
      data: errorData,
      msg: message,
    });
  }
}
