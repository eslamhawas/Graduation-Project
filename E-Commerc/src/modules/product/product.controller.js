import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import { fileValidationTypes, uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import * as productService from './services/product.service.js';
import * as validators from './services/product.validation.js';
import { authentication, authorization } from "../../middleware/auth.middelware.js";
import { endPoint } from "./services/product.authorization.js";
const router = Router()

router.get("/getProducts",productService.getProducts)

router.get("/:productId/getProduct",
    validation(validators.getProduct),
    productService.getProduct)

router.post("/",
    authentication(),
    authorization(endPoint.createProduct),
    uploadCloudFile(fileValidationTypes.image).array('attachment',2)
    ,validation(validators.createProduct),
    productService.createProduct)

router.patch("/:productId",
    authentication(),
    authorization(endPoint.updateProduct),
    uploadCloudFile(fileValidationTypes.image).array('attachment',2),
    validation(validators.updateProduct),
    productService.updateProduct)

router.patch("/:productId/editUserProduct",
    authentication(),
    authorization(endPoint.editUserProduct),
    validation(validators.editUserProduct),
    productService.editUserProduct
)

router.delete("/:id/deleteProduct",
    authentication(),
    authorization(endPoint.deleteProduct),
    validation(validators.deleteProduct),
    productService.deleteProduct)

router.post("/joinProductAsVendor",
    authentication(),
    authorization(endPoint.joinProductAsVendor),
    validation(validators.joinProductAsVendor),
    productService.joinProductAsVendor)

router.get("/filter",
    validation(validators.filterProducts),
    productService.filterProducts
)
export default router
