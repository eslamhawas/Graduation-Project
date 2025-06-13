import joi from 'joi'
export const createProduct = joi.object().keys({
    name : joi.string().min(4).max(50).trim().required(),
    brand: joi.string().lowercase().required(),
    sellPrice: joi.number().min(0).max(500000),
    quantity: joi.number().min(1),
    color: joi.string(),
    isAccept: joi.boolean().default(true),
    file: joi.object().options({allowUnknown: true}),
    length: joi.number().min(1).max(500),
    width: joi.number().min(1).max(500),
    categoryId: joi.number().integer().required(),
}).required()

export const updateProduct = joi.object().keys({
    name : joi.string().min(4).max(50).trim(),
    brand: joi.string().lowercase(),
    quantity: joi.number().min(1),
    color: joi.string(),
    isAccept: joi.boolean().default(true),
    file: joi.object().options({allowUnknown: true}),
    length: joi.number().min(1).max(500),
    width: joi.number().min(1).max(500),
    productId: joi.number().integer().required(),
    categoryId: joi.number().integer(),
}).required()

export const editUserProduct = joi.object({
  productId: joi.number().integer().required(),
  sellPrice: joi.number().min(0).max(500000),
  quantity: joi.number().min(1),
});


export const deleteProduct = joi.object().keys({
    id: joi.number().integer().required(),
}).required()

export const getProduct =  joi.object().keys({
    productId: joi.number().integer().required(),
}).required()

export const joinProductAsVendor = joi.object().keys({
    quantity: joi.number().min(1),
    productId: joi.number().integer().required(),
    sellPrice: joi.number().min(0).max(500000),
}).required()

export const filterProducts = joi.object({
    brand: joi.string().lowercase(),
    isAccept: joi.number().valid(0, 1)
}).required()