import joi from 'joi';

export const createCategory = joi.object().keys({
    name: joi.string().min(3).max(50).trim().required(),
    width: joi.number().min(1).max(1000),
    height: joi.number().min(1).max(1000),
    createdBy: joi.number().integer(),
    file: joi.object().options({ allowUnknown: true })
}).required();

export const updateCategory = joi.object().keys({
    id: joi.number().integer().required(),
    name: joi.string().min(3).max(50).trim(),
    width: joi.number().min(1).max(1000),
    height: joi.number().min(1).max(1000),
    createdBy: joi.number().integer(),
    file: joi.object().options({ allowUnknown: true })
}).required();

export const deleteCategory = joi.object().keys({
    categoryId: joi.number().integer().required(),
}).required();

export const getCategory = joi.object().keys({
    categoryId: joi.number().integer().required(),
}).required();

