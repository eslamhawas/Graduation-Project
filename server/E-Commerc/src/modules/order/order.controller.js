import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as orderService from './services/order.service.js';
import * as validators from './services/order.validation.js';
import { authentication, authorization } from "../../middleware/auth.middelware.js";

export const router = Router();

router.get("/orders",
    authentication(),
    authorization(['vendor']),
    validation(validators.getOrders),
    orderService.getOrders);

router.get("/:orderId/getOrder",
    authentication(),
    authorization(['vendor']),
    validation(validators.getOrder),
    orderService.getOrder);

router.post("/",
    authentication(),
    authorization(['customer']),
    validation(validators.createOrder),
    orderService.createOrder);

router.patch("/:id/fulfilOrder",
    validation(validators.updateOrder),
    orderService.updateOrder);

router.get("/:orderId/trackOrder",
    authentication(),
    authorization([ 'customer']),
    validation(validators.trackOrder),
    orderService.trackOrder  );

router.patch("/:orderId/modifyOrder",
    authentication(),
    authorization([ 'customer' ]),
    validation(validators.modifyOrder),
    orderService.modifyOrderItems);

router.patch("/:orderId/cancelOrder",
    authentication(),
    authorization(['customer']),
    validation(validators.cancelOrder),
    orderService.cancelOrder);

export default router;
