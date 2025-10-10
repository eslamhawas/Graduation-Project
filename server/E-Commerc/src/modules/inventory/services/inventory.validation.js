import joi from 'joi';

export const restockProduct = joi.object({
    productId: joi.number().integer().required(),
    quantity: joi.number().integer().min(1).required(),
}).required()

export const getInventory = joi.object().keys({
}).required();

export const getOrder = joi.object().keys({
    id: joi.number().integer().required(),
}).required();

