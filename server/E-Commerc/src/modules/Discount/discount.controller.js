import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as discountService from './services/discount.service.js';
import * as validators from './services/discount.validation.js';

export const router = Router()

router.post("/:userId/createDiscount",
    validation(validators.createDiscount),
    discountService.createDiscount
)
router.patch("/:discountId/:userId/updateDiscount",
    validation(validators.updateDiscount),
    discountService.updateDiscount
)
router.delete("/:discountId/:userId/deleteDiscount",
    validation(validators.deleteDiscount),
    discountService.deleteDiscount
)
router.get("/:userId",
    validation(validators.getDiscounts),
    discountService.getVendorDiscounts
)
export default router;
