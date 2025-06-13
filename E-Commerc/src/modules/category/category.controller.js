import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import { fileValidationTypes, uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import * as categoryService from './services/category.service.js';
import * as validators from './services/category.validation.js';
import { authentication, authorization } from "../../middleware/auth.middelware.js";

const router = Router()

router.get("/getCategories", categoryService.getCategories)

router.get("/:categoryId",
    validation(validators.getCategory),
    categoryService.getCategory)

router.post("/",
    authentication(),
    authorization(['admin ']),
    uploadCloudFile(fileValidationTypes.image).array('attachment', 2),
    validation(validators.createCategory),
    categoryService.createCategory)

router.patch("/:id",
    authentication(),
    authorization(['admin']),
    uploadCloudFile(fileValidationTypes.image).array('attachment', 2),
    validation(validators.updateCategory),
    categoryService.updateCategory)

router.delete("/:categoryId/deleteCategory",
    authentication(),
    authorization(["admin"]),
    validation(validators.deleteCategory),
    categoryService.deleteCategory)

export default router
