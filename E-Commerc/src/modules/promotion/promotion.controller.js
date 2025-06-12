import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as promotionService from './services/promotion.service.js';
import * as validators from './services/promotion.validation.js';
import { authentication, authorization } from "../../middleware/auth.middelware.js";

export const router = Router()

router.patch("/:productId/createPromotion",
    authentication(),
    authorization(['vendor']),
    validation(validators.createOrUpdatePromotion),
    promotionService.createOrUpdatePromotion
)
router.patch("/:productId/removePromotion",
    authentication(),
    authorization(['vendor']),
    validation(validators.removePromotion),
    promotionService.removePromotion
)
router.get("/:productId/getProductPromotion",
    authentication(),
    authorization(['vendor']),
    validation(validators.getProductPromotion),
    promotionService.getProductPromotion
)
router.get("/getAllVendorPromotions",
    authentication(),
    authorization(['vendor']),
    validation(validators.getAllVendorPromotions),
    promotionService.getAllVendorPromotions
)

export default router;



