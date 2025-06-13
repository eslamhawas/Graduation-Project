import { Op } from "sequelize"
import orderModel, { orderStatus } from "../../../DB/model/Order.model.js"
import OrderProductsModel from "../../../DB/model/OrderItem.model.js"
import productModel from "../../../DB/model/Product.model.js"
import cartProductsModel from "../../../DB/model/cartProduct.js"
import discountModel from "../../../DB/model/discount.model .js"
import UserProductsModel from "../../../DB/model/productUser.js"
import userModel from "../../../DB/model/user.model.js"
import { sendEmail } from "../../../utils/email/send.email.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import successResponse from "../../../utils/response/success.response.js"
import ProfitMarginModel from "../../../DB/model/profitMargin.model.js"

export const getOrders = asyncHandler(async (req, res, next) => {
        const orders = await OrderProductsModel.findAll({
            where: {  userId : req.user.id },
            include: [ { model: orderModel,where: { status: orderStatus.pending }},]
            });
        if (!orders) {
            return next(new Error("No orders found for this vendor"))
        }
        return successResponse({ res, data: orders })
})

export const getOrder = asyncHandler(async (req, res, next) => {
        const { orderId  } = req.params;
        const order = await OrderProductsModel.findOne({
            where: {orderId, userId: req.user.id },
            include: [ { model: orderModel},]
        })
        if (!order) {
            return next(new Error("not found this order"))
        }
        return successResponse({ res, data: { order } })
})

export const updateOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const order = await orderModel.findOne({ where: { id } })
    if (!order) return next(new Error("Order not found"))
    if (order.status === orderStatus.fulfilled) {
            return next(new Error("Order already fulfilled"));
        }
    const orderItems = await OrderProductsModel.findAll({ where: { orderId: id } })
    if (!orderItems || orderItems.length === 0) return next(new Error("No products in this order"))
    for (const item of orderItems) {
        const userProduct = await UserProductsModel.findOne({
            where: {
                productId: item.productId,
                userId: item.userId,
                quantity: { [Op.gte]: item.quantity }
            }
        })
        if (!userProduct) {
            return next(new Error(`Not enough quantity for product ID ${item.productId} by this vendor`));
        }
        if ( userProduct.userId  !==  item.userId ) {
            return next(new Error(`You are not allowed to fulfill product ID ${item.productId}`));
        }
        await userProduct.update({
            quantity: userProduct.quantity - item.quantity
        })
    }
    await order.update({ status: orderStatus.fulfilled });
    await cartProductsModel.destroy({
        where: { cartId: order.cartId }
    });
    for (const item of orderItems) {
        const userProduct = await UserProductsModel.findOne({ where: { productId: item.productId, userId: item.userId } })
        if (!userProduct) {
            return next(new Error(`Product ${item.productId} not found in inventory after order fulfillment`))
        }
        if (userProduct.quantity <= 10) {
            const vendor = await userModel.findOne({ where: { id: item.userId } })
            if (!vendor || !vendor.email) {
                return next(new Error(`Vendor email not found for user ID ${item.userId}`))
            }
            await sendEmail({
                to: vendor.email,
                subject: `Urgent: Product ${item.productId} is low on stock`,
                message: `Dear Vendor,\n\nThe stock of product ID ${item.productId} is below the threshold. Please update the stock as soon as possible.\n\nThank you.`
            });
            const product = await productModel.findOne({ where: { id: item.productId } })
            if (product) {
                await product.update({ isAvailable: false })
            }
        }
    }
    return successResponse({ res, data: { order } })
})

export const createOrder = asyncHandler(async (req, res, next) => {
    const {cartId,discountId } = req.body
    const user = await userModel.findOne({ where: { id: req.user.id } })
    if (!user) {
    return next(new Error('User not found'));
    }
    const cartItems = await cartProductsModel.findAll({ where: { cartId } })
    if (!cartItems || cartItems.length === 0) {
    return next(new Error('Cart is empty'))
    }
    const today = new Date()
    let totalPrice = 0
    const orderItems = []
    for (const item of cartItems) {
    const product = await productModel.findOne({where: { id: item.productId, isAvailable: true }})
    if (!product) {
        return next(new Error(`Product with id ${item.productId} not found or unavailable`))
    }
    const userProduct = await UserProductsModel.findOne({ where: { userId: item.userId, productId: product.id } })
        
        if (!userProduct || typeof userProduct.sellPrice !== 'number') {
        return next(new Error(`Vendor price not found for product ${product.id}`));
    }
     // Get base price from UserProducts
    let salePrice = userProduct.sellPrice

    // Add profit margin (from admin settings)
    const profitMargin = await ProfitMarginModel.findOne({
    where: {
        startDate: { [Op.lte]: today },
        [Op.or]: [{ endDate: { [Op.gte]: today } }, { endDate: null }]
    },
    order: [['startDate', 'DESC']]
    })
    if (profitMargin) {
    const margin = profitMargin.profitPercentage;
      salePrice += (salePrice * margin) / 100;
    }
     // Apply promotion if valid (from UserProducts)
    if (
    userProduct.hasPromotion === true && userProduct.promotionPercentage && new Date(userProduct.promotionExpiryDate) >= today
) {
  salePrice -= (salePrice * userProduct.promotionPercentage) / 100
}

    salePrice = parseFloat(salePrice.toFixed(2));
    totalPrice += salePrice * item.quantity;
    orderItems.push({
    userId: item.userId,
    productId: product.id,
    price: salePrice,
    quantity: item.quantity
    })
    }
  // Apply order-level discount if available
    if (discountId) {
    const discount = await discountModel.findOne({
        where: {
        id: discountId,
        startDate: { [Op.lte]: today },
        endDate: { [Op.gte]: today }
        }
    })
    if (!discount) {
    return next(new Error('Discount is not valid or has expired'))
    }

    totalPrice -= (totalPrice * discount.discountPercentage) / 100
    }
    totalPrice = parseFloat(totalPrice.toFixed(2))

  // Create the order
    const order = await orderModel.create({
    userId:req.user.id,
    cartId,
    totalPrice,
    discountId: discountId || null
    })
    for (const item of orderItems) {
    await OrderProductsModel.create({
    orderId: order.id,
    userId: item.userId,
    productId: item.productId,
    price: item.price,
    quantity: item.quantity
    })
    }

  // Clear the cart
    await cartProductsModel.destroy({ where: { cartId } })
    return successResponse({ res, data: { order } })
})

export const trackOrder = asyncHandler(async (req, res, next) => {
    const {orderId } = req.params
    const order = await orderModel.findOne({ where: { id : orderId} })
    if (!order) {
        return next(new Error("Order not found"))
    }
    return successResponse({ res, data: { order } })
})

export const calculateTotalPrice = async (orderId) => {
    const orderProducts = await OrderProductsModel.findAll({ where: { orderId } });

    let totalPrice = 0;
    for (const item of orderProducts) {
      totalPrice += item.price * item.quantity;
    }
    return totalPrice;
}

export const modifyOrderItems = asyncHandler(async (req, res, next) => {
    const { orderId, updates } = req.body
    const order = await orderModel.findOne({ where: {
        id: orderId,
        userId: req.user.id,
        status: orderStatus.pending } });
    if (!order) {
        return next(new Error("Order not found or cannot be modified."));
    }
    for (const update of updates) {
        const { productId, newQuantity } = update
        const orderProduct = await OrderProductsModel.findOne({ where: { orderId, productId } })
        if (!orderProduct) {
            return next(new Error(`Product with ID ${productId} not found in this order.`))
        }
        if (newQuantity === 0) {
            await orderProduct.destroy()
            continue
        }
        const userProduct = await UserProductsModel.findOne({
            where: { productId, userId: orderProduct.userId }
        })
        if (!userProduct || userProduct.quantity < newQuantity) {
            return next(new Error(`Not enough stock available for product ID ${productId}.`))
        }
        await orderProduct.update({ quantity: newQuantity })
    }
    const updatedOrder = await orderModel.findOne({ where: { id: orderId } })
    updatedOrder.totalPrice = await calculateTotalPrice(updatedOrder.id)
    await updatedOrder.save()
    return successResponse({ res, data: updatedOrder })
})

export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params
    const order = await orderModel.findOne({ where: { id: orderId , userId: req.user.id} })
    if (!order) {
        return next(new Error("Order not found or cannot be canceled"))
    }
    if (order.status !== orderStatus.pending) {
        return next(new Error("Only pending orders can be cancelled"))
    }
    await order.update({ status: orderStatus.cancelled });
    return successResponse({ res, message: "Order cancelled successfully" })
})



