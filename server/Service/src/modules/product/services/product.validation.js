import joi from 'joi'
import { Types } from 'mongoose'
const checkObjectId=(value, helper)=>{
    return Types.ObjectId.isValid(value)? true: helper.message("in-valid ObjectId")
}
export const createProduct = joi.object().keys({
    name : joi.string().min(4).max(50).trim().required(),
    price: joi.number().min(0).max(500000).required(),
    quantity: joi.number().min(1),
    color: joi.string(),
    isAccept: joi.boolean().default(true),
    file: joi.object().options({allowUnknown: true}),
    length: joi.number().min(1).max(500),
    width: joi.number().min(1).max(500)
}).required()

export const updateProduct = joi.object().keys({
    name : joi.string().min(4).max(50).trim(),
    price: joi.number().min(0).max(500000) ,
    quantity: joi.number().min(1),
    color: joi.string(),
    isAccept: joi.boolean().default(true),
    file: joi.object().options({allowUnknown: true}),
    length: joi.number().min(1).max(500),
    width: joi.number().min(1).max(500),
    id: joi.string().custom(checkObjectId),
}).required()

export const deleteProduct = joi.object().keys({
    id:joi.string().custom(checkObjectId),
}).required()

export const getProduct =  joi.object().keys({
    productId:joi.string().custom(checkObjectId),
}).required()
