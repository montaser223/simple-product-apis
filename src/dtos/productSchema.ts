import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(10).max(500).optional(),
    price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(0).required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).optional(),
    description: Joi.string().trim().min(10).max(500).optional(),
    price: Joi.number().positive().precision(2).optional(),
    stock: Joi.number().integer().min(0).optional(),
}).min(1); // At least one field is required for update
