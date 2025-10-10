import discountModel from "../../../DB/model/discount.model .js";
import orderModel from "../../../DB/model/Order.model.js";
import OrderProductsModel from "../../../DB/model/OrderItem.model.js";
import productModel from "../../../DB/model/Product.model.js";
import UserProductsModel from "../../../DB/model/productUser.js";
import userModel from "../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import successResponse from "../../../utils/response/success.response.js";
import cron from 'node-cron';
import { Op } from 'sequelize';

export const createDiscount = asyncHandler(async(req, res, next)=>{
    const {userId} =req.params
    const discount = await discountModel.create(req.body)
    return successResponse({res, data:{ discount}})
})

export const updateDiscount = asyncHandler(async (req, res, next) => {
    const { discountId, userId } = req.params
    const discount = await discountModel.findOne({ where: { id: discountId } })
    if (!discount) {
        return next(new Error("Discount not found"))
    }
    if (discount.userId.toString() !== userId) {
        return next(new Error("You are not authorized to modify this discount"))
    }
    await discount.update(req.body)

    return successResponse({ res, data: { discount } })
})

export const deleteDiscount = asyncHandler(async (req, res, next) => {
    const { discountId, userId } = req.params
    const discount = await discountModel.findOne({ where: { id: discountId } })
    if (!discount) {
        return next(new Error("Discount not found"))
    }
    if (discount.userId.toString() !== userId) {
        return next(new Error("You are not authorized to delete this discount"))
    }
    await discount.destroy()
    return successResponse({ res, data: { message: "Discount deleted successfully" } })
})

export const getVendorDiscounts = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const user = await userModel.findOne({ where: { id: userId } })
    if (!user) return next(new Error("User not found"))
    const userProducts = await OrderProductsModel.findAll({
        where: { userId },
        include: [
            {
            model: orderModel,
            include: [
            {
            model: discountModel,
            required: false
            }] }]
    })
    const discounts = userProducts
        .filter(up => up.Product && up.Product.Discount)
        .map(up => ({
            productId: up.productId,
            productName: up.Product.name,
            discountPercentage: up.Product.Discount.discountPercentage,
            startDate: up.Product.Discount.startDate,
            endDate: up.Product.Discount.endDate
        }))
    return successResponse({ res, data: { discounts } });
})

export const cleanExpiredDiscounts = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('Checking for expired discounts...')
        const now = new Date()
        const expiredDiscounts = await discountModel.findAll({
            where: {
            endDate: { [Op.lte]: now }
            }
        })
        if (expiredDiscounts.length === 0) {
            console.log('No expired discounts found.')
            return
        }
        for (const discount of expiredDiscounts) {
            await orderModel.update(
                { discountId: null },
                { where: { discountId: discount.id } }
            )
            await discount.destroy()
        console.log(`Expired discount with ID ${discount.id} cleaned and removed.`)
        }
        console.log(`Total expired discounts cleaned: ${expiredDiscounts.length}`)
    })
}

