import Joi from 'joi';

export const orderIdSchema = Joi.object({
    orderId: Joi.number().integer().positive().required(),
});
