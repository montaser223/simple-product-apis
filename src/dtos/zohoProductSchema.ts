import Joi from 'joi';

export const createZohoProductSchema = Joi.object({
    Product_Name: Joi.string().trim().min(1).max(100).required(),
    Description: Joi.string().trim().max(500).required(),
    Unit_Price: Joi.number().positive().precision(2).required(),
    Qty_in_Stock: Joi.number().integer().min(0).required(),
});
