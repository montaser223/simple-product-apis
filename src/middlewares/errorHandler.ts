import { Request, Response, NextFunction } from 'express';
import {  HTTP_STATUS, ERROR_CODES } from '@/consts';
import { ILogger } from '@/interfaces/ILogger';
import { TYPES } from '@/types';
import { container } from '@/inversify.config';
import { AppError } from '@/utils/appError';

const appLogger = container.get<ILogger>(TYPES.ILogger);

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let error = err;

    // Handle operational errors (AppError instances)
    if (error instanceof AppError) {
        appLogger.warn({
            message: `Operational Error: ${error.message}`,
            module: 'ErrorHandler',
            action: 'HandleOperationalError',
            output: {
                statusCode: error.statusCode,
                errorCode: error.code,
                path: req.path,
                method: req.method,
                stack: error.stack
            }
        });
        return res.status(error.statusCode).json({
            code: error.code,
            message: error.message,
        });
    }

    // Handle unexpected errors
    appLogger.error({
        message: `Unhandled Error: ${error.message}`,
        module: 'ErrorHandler',
        action: 'HandleUnhandledError',
        output: {
            path: req.path,
            method: req.method,
            error: error,
            stack: error.stack
        }
    });

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        code: ERROR_CODES.INTERNAL_SERVER_ERROR.code,
        message: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    });
};
