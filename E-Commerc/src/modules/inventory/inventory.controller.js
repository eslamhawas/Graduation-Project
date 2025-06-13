import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as inventoryService from './services/inventory.service.js';
import * as validators from './services/inventory.validation.js';
import { authentication, authorization } from "../../middleware/auth.middelware.js";

export const router = Router();

router.get("/viewInventory",
    authentication(),
    authorization(['vendor', 'admin']),
    validation(validators.getInventory),
    inventoryService.getInventory)

router.patch("/:productId",
    authentication(),
    authorization(['vendor', 'admin']),
    validation(validators.restockProduct),
    inventoryService.restockProduct)

export default router;


