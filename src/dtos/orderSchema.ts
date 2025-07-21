import Joi from 'joi';

export const createOrderSchema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().min(1).required(),
});

export const updateOrderSchema = Joi.object({
    quantity: Joi.number().integer().min(1).required(), // Quantity is the only updatable field
});
