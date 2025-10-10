import { asyncHandler } from "../utils/response/error.response.js";
import { decodedToken } from "../utils/security/token.security.js";

export const authentication= () => {
    return asyncHandler(async (req, res, next) => {
    req.user= await decodedToken({ authorization: req.headers.authorization, next })
    return next()
})
}

export const authorization= (accessRoles=[])=>{
    return asyncHandler(async(req,res,next)=>{
        if(!accessRoles.includes(req.user.role)){
            console.log('USER ROLE:', req.user.role)
console.log('ALLOWED ROLES:', accessRoles)
        return next(new Error("not authorize account",{cause:403}))
        }
    return next()
})
}
