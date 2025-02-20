import  successResponse  from "../../../utils/response/success.response.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import productModel from "../../../DB/model/Product.model.js"
import { cloud } from "../../../utils/multer/cloudinary.js"
import {pagination} from "../../../utils/pagination/pagination.js"

const populateList=[
    {path: 'category', select: "name"},
    ]
export const getProducts = asyncHandler(
    async(req, res,next ) => {
        
        const {page, size} =req.query
    const data =  await pagination({
        model :productModel,
        page,
        size,
        populate: populateList
    })
        return successResponse({ res, data: {data} })
})

export const getProduct = asyncHandler(
    async(req, res,next ) => {
        
        const {productId} =req.params
        
        const product = await productModel. findById({_id: productId})
        if (!product) {
            return next (new Error("not found this product"))
        }
        return successResponse({ res, data: {product} })
})

export const createProduct= asyncHandler(async(req, res, next) =>{
    const {name, color, quantity, price, length, width, category , isAccept} = req.body

    const attachments =[]
    for (const file of  req.files) {
        const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "e-commerce/product"})
        attachments.push({secure_url, public_id})
    }
    const product = await productModel.create({name, color, quantity, price, length, width, category , isAccept, attachments})

    return successResponse({res , data:{product}})
})

export const updateProduct =asyncHandler(async(req, res, next) =>{
    const {id}=req.params
    if(req.files?.length){
        const attachments= []
        for (const file of req.files) {
            const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "socialApp/post"})
            attachments.push({secure_url, public_id})
        }
        req.body.attachments= attachments
        }
    const product = await productModel.findOneAndUpdate({_id: id}, {...req.body} ,{new :true})
    if (!product) {
        return next(new Error("not found any product with this id "))
    }
    return successResponse({res , data:{product}})
})

export const deleteProduct = asyncHandler(async(req, res, next) =>{
    const {id} =req.params
    const product = await productModel.findOneAndDelete({_id: id})
    if (!product) {
        return next(new Error("not found any product with this id"))
    }
    return successResponse({res})
})


