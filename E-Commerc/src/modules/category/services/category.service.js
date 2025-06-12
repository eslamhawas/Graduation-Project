import  successResponse  from "../../../utils/response/success.response.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import productModel from "../../../DB/model/Product.model.js"
import { cloud } from "../../../utils/multer/cloudinary.js"
import {pagination} from "../../../utils/pagination/pagination.js"
import CategoryModel from "../../../DB/model/Category.model.js"

const populateList = [{
    model: productModel,
    as: 'Products'
    }]
export const getCategories = asyncHandler(
    async(req, res,next ) => {
        
        const {page, size} =req.query
    const data =  await pagination({
        model :CategoryModel,
        page,
        size,
        populate: populateList
    })
        return successResponse({ res, data: {data} })
})

export const getCategory = asyncHandler(
    async(req, res,next ) => {
        
        const {categoryId} =req.params
        
        const category = await CategoryModel.findByPk(categoryId,
            {
                include: [
                { model: productModel,
                    as: 'Products',
                    },]
    })
        if (!category) {
            return next (new Error("not found this category"))
        }
        return successResponse({ res, data: {category} })
})

export const createCategory= asyncHandler(async(req, res, next) =>{
    const {name,  length, width } = req.body
    const attachments =[]
    for (const file of  req.files) {
        const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "e-commerce/category"})
        attachments.push({secure_url, public_id})
    }
    const category = await CategoryModel.create({name, length, width, attachments})

    return successResponse({res , data:{category}})
})

export const updateCategory =asyncHandler(async(req, res, next) =>{
    const {id}=req.params
    if(req.files?.length){
        const attachments= []
        for (const file of req.files) {
            const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "E-Commerce/category"})
            attachments.push({secure_url, public_id})
        }
        req.body.attachments= attachments
        }
        const category = await CategoryModel.findOne({ where: { id } });
        if (!category) {
        return next(new Error("Category not found"));
        }
    await category.update(req.body);
    return successResponse({res , data:{category}})
})

export const deleteCategory = asyncHandler(async(req, res, next) =>{
    const {categoryId} =req.params
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
        return next(new Error("not found any category with this id"))
    }
    await category.destroy();
    return successResponse({res})
})


