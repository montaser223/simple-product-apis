import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ERROR_CODES } from '@/consts';
import { ILogger } from '@/interfaces/ILogger';
import { TYPES } from '@/types';
import { container } from '@/inversify.config';
import { AppError } from '@/utils/appError';

const appLogger = container.get<ILogger>(TYPES.ILogger);

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, _: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            appLogger.warn({
                message: 'Validation Error',
                module: 'ValidationMiddleware',
                action: 'ValidateRequestBody',
                output: {
                    errors: errors,
                    requestBody: req.body,
                }
            });

            throw new AppError(ERROR_CODES.VALIDATION_ERROR, JSON.stringify(errors));
        }

        next();
    };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, _: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params, { abortEarly: false, allowUnknown: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            appLogger.warn({
                message: 'Validation Error',
                module: 'ValidationMiddleware',
                action: 'ValidateRequestParams',
                output: {
                    errors: errors,
                    requestParams: req.params,
                }
            });

            throw new AppError(ERROR_CODES.VALIDATION_ERROR, JSON.stringify(errors));
        }

        next();
    };
};
