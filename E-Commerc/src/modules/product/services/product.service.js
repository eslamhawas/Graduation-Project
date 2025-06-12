import { Op } from "sequelize"
import CategoryModel from "../../../DB/model/Category.model.js"
import productModel from "../../../DB/model/Product.model.js"
import ProductProvider from "../../../DB/model/productUser.js"
import ProfitMarginModel from "../../../DB/model/profitMargin.model.js"
import userModel from "../../../DB/model/user.model.js"
import { cloud } from "../../../utils/multer/cloudinary.js"
import { pagination } from "../../../utils/pagination/pagination.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import successResponse from "../../../utils/response/success.response.js"

const populateList = [{
    model: ProductProvider,
    }]
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

export const getProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const today = new Date()
    const product = await productModel.findByPk(productId, {
    include: [
    {
        model: CategoryModel,
        as: 'Category',
    },
    {
        model: ProductProvider,
        as: 'UserProducts',
        include: [userModel],
    }],
})
    if (!product) {
    return next(new Error('not found this product'))
    }
    if (Array.isArray(product.UserProducts)) {
    for (const productUser of product.UserProducts) {
    const basePrice = productUser.sellPrice
    let salePrice = basePrice
    if (typeof basePrice === 'number') {
    //  Apply profit margin
    const profitMargin = await ProfitMarginModel.findOne({
    where: {
    startDate: { [Op.lte]: today },
    [Op.or]: [{ endDate: { [Op.gte]: today } }, { endDate: null }],
    },
    order: [['startDate', 'DESC']],
})
    if (profitMargin) {
    const margin = profitMargin.profitPercentage
    salePrice += (basePrice * margin) / 100
    } //  Apply promotion
    if ( productUser.hasPromotion === true &&
        productUser.promotionPercentage &&
        new Date(productUser.promotionExpiryDate) >= today
        ) {
          salePrice -= (salePrice * productUser.promotionPercentage) / 100
        }
        // Final price
        productUser.dataValues.salePrice = parseFloat(salePrice.toFixed(2));
    } else {
        productUser.dataValues.salePrice = null;
    } } }

    return successResponse({ res, data: { product } });
})

export const editUserProduct = asyncHandler(async (req, res, next) => {
    const {productId} = req.params
    const { quantity, sellPrice} = req.body;
    const userProduct = await ProductProvider.findOne({
    where: {
    productId,
    userId:req.user.id,
    },
})
    if (!userProduct) {
    return next(new Error('You are not allowed to update this product or it does not exist.'));
    }
    const product=  await ProductProvider.update({quantity, sellPrice}, {
    where: {
    productId,
    userId:req.user.id,
    },
})
    return successResponse({ res, message: 'Product updated successfully', data: product });
})

export const joinProductAsVendor = asyncHandler(async (req, res, next) => {
    const { productId, quantity,sellPrice} = req.body;
    const user = await userModel.findOne({ where: { id: req.user.id } });
    if (!user) {
    return next(new Error('User not found'));
    }
    const product = await productModel.findOne({ where: { id: productId } });
    if (!product) {
    return next(new Error('Product not found'));
    }
    const existingUserProduct = await ProductProvider.findOne({ where: { userId: req.user.id, productId }})
    if (existingUserProduct) {
    return next(new Error('Vendor has already joined this product'));
    }
    const userProduct = await ProductProvider.create({
    userId: req.user.id,
    productId,
    quantity,
    sellPrice,
    })
    return successResponse({res, message: 'Product successfully added to vendor\'s products',data: userProduct})
})

export const filterProducts = asyncHandler(async (req, res, next) => {
    const { page, size, brand, isAccept } = req.query
    const filter = {}
    if (brand) filter.brand = brand.toLowerCase()
    if (isAccept !== undefined) {
    if (isAccept === 'true' || isAccept === '1') filter.isAccept = 1
    else if (isAccept === 'false' || isAccept === '0') filter.isAccept = 0 }
    const data = await pagination({
    model: productModel,
    filter,
    size,
    page,
    sort: { createdAt: -1 },
    populate: populateList
    })
    const today = new Date()
    for (const product of data.result) {
    if (Array.isArray(product.UserProducts)) {
    for (const productUser of product.UserProducts) {
        const basePrice = productUser.sellPrice;
        let salePrice = basePrice
    if (typeof basePrice === 'number') {
        const profitMargin = await ProfitMarginModel.findOne({
        where: {
        startDate: { [Op.lte]: today },
        [Op.or]: [
        { endDate: { [Op.gte]: today } },
        { endDate: null }
        ]},
            order: [['startDate', 'DESC']] })
            console.log('basePrice:', basePrice)
    if (profitMargin) {
        const margin = profitMargin.profitPercentage;
        salePrice = basePrice + (basePrice * margin / 100)
        }
    if (
        productUser.hasPromotion === true &&
        productUser.promotionPercentage &&
        new Date(productUser.promotionExpiryDate) >= today
        ) {
            salePrice = salePrice - (salePrice * productUser.promotionPercentage / 100)
        } productUser.dataValues.salePrice = parseFloat(salePrice.toFixed(2))
        } else {
        productUser.dataValues.salePrice = null
        }
    }
    }
}  return successResponse({ res, data: data.result, meta: { count: data.count, page: data.page, size: data.size } })
})

export const updateProduct =asyncHandler(async(req, res, next) =>{
    const {productId }=req.params
    if(req.files?.length) {
        const attachments= []
        for (const file of req.files) {
            const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "E-Commerce/Product"})
            attachments.push({secure_url, public_id})
        }
        req.body.attachments= attachments
        }
        const user = await userModel.findOne({where:{id: req.user.id}})
        if (!user) {
            return next(new Error("not found any user with this id "))
        }
        if (user.role !== 'admin') {
        return next(new Error(" not authorized"))
    }
        const product =  await productModel.findOne({ where: { id: productId } });
        if (!product) {
        return next(new Error("not found any product with this id "))
    }
    if (req.body.categoryId) {
        const category = await CategoryModel.findOne({ where: { id: req.body.categoryId } });
        if (!category) {
        return next(new Error("Category not found"));
        }
    }
    await product.update(req.body);
    return successResponse({res , data:{product}})
})

export const createProduct= asyncHandler(async(req, res, next) =>{
    const {name, color, brand, length, width, categoryId , isAccept , quantity,  sellPrice } = req.body
    const user = await userModel.findOne({ where: { id: req.user.id } })
    if (!user || (user.role !== 'admin' && user.role !== 'vendor')) {
    return next(new Error("Not authorized to create a product"))
    }
    const category = await CategoryModel.findOne({ where: { id: categoryId } });
    if (!category) {
        return next (new Error("not found"))
    }
    const attachments =[]
    for (const file of  req.files) {
        const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "e-commerce/product"})
        attachments.push({secure_url, public_id})
    }
    const product = await productModel.create({name, color, quantity, brand, length, width, categoryId , isAccept, attachments })
    if (user.role == 'vendor') {
    await UserProducts.create({
    userId: req.user.id,
    productId: product.id,
    quantity,
    sellPrice
    })
}
    return successResponse({res , data:{product}})
})

export const deleteProduct = asyncHandler(async(req, res, next) =>{
    const {id } =req.params
    const user = await userModel.findOne({ where: { id: req.user.id } });
    if (!user) {
    return next(new Error("User not found"));
    }
    if (user.role !== 'admin') {
    return next(new Error("Not authorized. Only Admin can delete a product"));
    }
    const product = await productModel.findByPk(id);
    if (!product) {
        return next(new Error("not found any product with this id"))
    }
    await product.destroy();
    return successResponse({res})
})
