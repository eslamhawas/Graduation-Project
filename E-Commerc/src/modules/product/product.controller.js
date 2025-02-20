import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import { fileValidationTypes, uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import * as productService from './services/product.service.js';
import * as validators from './services/product.validation.js';
const router = Router()

router.get("/getProducts",productService.getProducts)

router.get("/:productId/getProduct",
    validation(validators.getProduct),
    productService.getProduct)

router.post("/",
    uploadCloudFile(fileValidationTypes.image).array('attachment',2)
    ,validation(validators.createProduct),
    productService.createProduct)

router.patch("/:id",
    uploadCloudFile(fileValidationTypes.image).array('attachment',2),
    validation(validators.updateProduct),
    productService.updateProduct)

router.delete("/:id/deleteProduct",
    validation(validators.deleteProduct),
    productService.deleteProduct)

    //router.get("/products",productService.products)
export default router
