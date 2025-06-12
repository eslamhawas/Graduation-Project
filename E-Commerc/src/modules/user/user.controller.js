import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as userService from './services/user.service.js';
import * as validators from './services/user.validation.js';

const router = Router();

router.post("/",
    userService.createUser);

export default router;
