import  successResponse  from "../../../utils/response/success.response.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import productModel from "../../../DB/model/Product.model.js"
import UserProductsModel from "../../../DB/model/productUser.js"

export const getInventory = asyncHandler(async (req, res, next) => {
    const inventory = await UserProductsModel.findAll({
    where: { userId: req.user.id },
    include: [{
        model: productModel,
    }]
    })
    return successResponse({
    res,
    message: "Inventory fetched successfully",
    data: inventory
    });
})

export const  restockProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const userProduct = await UserProductsModel.findOne({ where: { productId , userId:req.user.id} });

    if (!userProduct) {
        return next(new Error(" product not found"));
    }

    await userProduct.update({ quantity });

    const product = await productModel.findOne({ where: { id: userProduct.productId } });

    if (!product) {
        return next(new Error("Product not found"));
    }
    if (quantity > 10) {
        await product.update({ isAvailable: true });
    }
    return successResponse({ res, message: "Product quantity updated successfully", data: { userProduct } });
})
