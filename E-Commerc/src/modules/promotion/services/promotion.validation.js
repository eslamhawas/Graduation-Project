import joi from 'joi'

export const createOrUpdatePromotion = joi.object().keys({
    productId: joi.number().integer().required(),
    promotionPercentage: joi.number().min(0).max(100).required(),
    promotionExpiryDate: joi.date().required(),
    hasPromotion: joi.boolean().default(false),
}).required()

export const updateDiscount = joi.object().keys({
    productId: joi.number().integer().required(),
    discountPercentage: joi.number().min(0).max(100),
    startDate: joi.date(),
    endDate: joi.date().greater(joi.ref('startDate'))
}).required()

export const removePromotion = joi.object().keys({
    productId: joi.number().integer().required(),
}).required()

export const getAllVendorPromotions = joi.object().keys({
}).required()

export const getProductPromotion= removePromotion