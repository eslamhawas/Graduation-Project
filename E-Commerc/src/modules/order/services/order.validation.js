import joi from 'joi';

export const createOrder = joi.object({
    cartId: joi.number().integer().required(),
    discountId: joi.number().integer(),
}).required()

export const updateOrder = joi.object().keys({
    id: joi.number().integer().required(),
}).required()

export const getOrders = joi.object().keys({
}).required()

export const getOrder = joi.object().keys({
    orderId: joi.number().integer().required(),
}).required()

export const modifyOrder = joi.object().keys({
    orderId: joi.number().integer().required(),
    updates: joi.array().items(
        joi.object({
        productId: joi.number().integer().positive().required(),
        newQuantity: joi.number().integer().positive().required()
        })
    ).min(1).required()
}).required()

export const trackOrder = joi.object().keys({
    orderId: joi.number().integer().required(),
}).required()

export const cancelOrder = joi.object().keys({
    orderId: joi.number().integer().required(),
}).required()