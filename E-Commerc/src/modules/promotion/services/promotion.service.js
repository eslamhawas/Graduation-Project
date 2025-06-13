import { asyncHandler } from "../../../utils/response/error.response.js";
import successResponse from "../../../utils/response/success.response.js";
import UserProductsModel from "../../../DB/model/productUser.js";
import productModel from "../../../DB/model/Product.model.js";
import cron from 'node-cron';

export const createOrUpdatePromotion = asyncHandler(async (req, res, next) => {
    const { productId} = req.params
    const product = await productModel.findOne({ where: { id: productId, isAvailable: true } })
    if (!product) {
        return next(new Error("Product not found or not available"))
    }
    const userProduct = await UserProductsModel.findOne({ where: { userId:req.user.id, productId } })
    if (!userProduct) {
        return next(new Error("Not authorized: You are not the owner of this product"))
    }
    await userProduct.update(req.body)
    return successResponse({ res, message: "Promotion created/updated successfully", data: { userProduct } })
})

export const removePromotion = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findOne({ where: { id: productId, isAvailable: true } })
    if (!product) {
        return next(new Error("Product not found or not available"))
    }
    const userProduct = await UserProductsModel.findOne({ where: { userId:req.user.id , productId } })
    if (!userProduct) {
        return next(new Error("Not authorized: You are not the owner of this product"))
    }
    await userProduct.update({
        hasPromotion: false,
        promotionPercentage: null,
        promotionExpiryDate: null
    })
    return successResponse({ res, message: "Promotion removed successfully" })
})

export const getProductPromotion = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findOne({ where: { id: productId, isAvailable: true } })
    if (!product) {
        return next(new Error("Product not found or not available"))
    }
    const userProduct = await UserProductsModel.findOne({ where: { userId:req.user.id, productId } })
    if (!userProduct) {
        return next(new Error("Not authorized: You are not the owner of this product"))
    }
    if (!userProduct.hasPromotion) {
        return next(new Error("No active promotion on this product"));
    }
    return successResponse({ res, data: { promotion: {
        promotionPercentage: userProduct.promotionPercentage,
        promotionExpiryDate: userProduct.promotionExpiryDate
    } }})
})

export const getAllVendorPromotions = asyncHandler(async (req, res, next) => {
    const promotions = await UserProductsModel.findAll({
        where: {
            userId:req.user.id,
            hasPromotion: true
        },
        include: [{
            model: productModel,
            attributes: ['id', 'name', 'isAvailable']
        }]
    })
    if (!promotions || promotions.length === 0) {
        return next(new Error("No promotions found for this vendor"));
    }
    return successResponse({ res, data: { promotions } });
})

export const cleanExpiredPromotions = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('Checking for expired promotions...')
        const now = new Date()
        const [affectedRows] = await UserProductsModel.update(
            {
                hasPromotion: false,
                promotionPercentage: null,
                promotionExpiryDate: null
            },
            {
                where: {
                    hasPromotion: true,
                    promotionExpiryDate: { [Op.lte]: now }
                }
            })
        console.log(`Expired promotions cleaned: ${affectedRows}`);
    })
}



