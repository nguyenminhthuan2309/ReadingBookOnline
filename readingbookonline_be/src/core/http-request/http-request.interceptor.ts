import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { ERROR_CODES } from './http-request.constants';
import { ApiResponse } from './http-request.types';

@Injectable()
export class HttpRequestInterceptor<T> implements NestInterceptor {
    private readonly logger = new Logger(HttpRequestInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                status: true,
                code: 'SUCCESS',
                message: 'Request successful',
                data,
            })),
            catchError((error) => {
                if (error instanceof AxiosError) {
                    const { response, config } = error;
                    const moduleKey = config?.headers?.['X-Module'] || 'UNKNOWN';
                    const errorCode = ERROR_CODES[moduleKey]?.[response?.status] || `${moduleKey}500`;

                    this.logger.error(
                        `🚨 API ERROR: [${moduleKey}] ${errorCode} - ${response?.statusText || 'Unknown error'}`,
                    );

                    return throwError(() => ({
                        status: false,
                        code: errorCode,
                        message: ERROR_CODES[moduleKey]?.[errorCode] || 'Unknown error occurred',
                    }));
                }

                return throwError(() => ({
                    status: false,
                    code: 'UNKNOWN_ERROR',
                    message: 'An unexpected error occurred',
                }));
            }),
        );
    }
}
