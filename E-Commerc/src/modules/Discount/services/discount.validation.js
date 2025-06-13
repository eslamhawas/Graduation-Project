import joi from 'joi'

export const createDiscount = joi.object().keys({
    userId: joi.number().integer().required(),
    discountPercentage: joi.number().min(0).max(100).required(),
    startDate: joi.date().required(),
    endDate: joi.date().greater(joi.ref('startDate')).required()
}).required()

export const updateDiscount = joi.object().keys({
    discountId: joi.number().integer().required(),
    userId: joi.number().integer().required(),
    discountPercentage: joi.number().min(0).max(100),
    startDate: joi.date(),
    endDate: joi.date().greater(joi.ref('startDate'))
}).required()

export const deleteDiscount = joi.object().keys({
    discountId: joi.number().integer().required(),
    userId: joi.number().integer().required(),
}).required()

export const getDiscounts = joi.object().keys({
    userId: joi.number().integer().required(),
}).required()