import  successResponse  from "../../../utils/response/success.response.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import userModel from "../../../DB/model/user.model.js"

export const createUser= asyncHandler(async(req, res, next) =>{
    const {email ,password , role , phoneNumber} = req.body
    const user = await userModel.create({email ,password , role , phoneNumber})
    return successResponse({res , data:{user}})
})


