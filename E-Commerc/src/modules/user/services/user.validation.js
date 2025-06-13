import joi from 'joi';

export const createUser = joi.object().keys({
    name: joi.string().min(3).max(50).trim().required(),
}).required();
