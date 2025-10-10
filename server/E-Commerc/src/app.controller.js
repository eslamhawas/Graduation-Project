import path from "node:path"
import dotenv from 'dotenv'
dotenv.config({path : path.resolve("./src/config/.env.dev")})
import { connectionDB, syncDB } from './DB/connection.js'
console.log("Dialect:", process.env.DB_DIALECT)
console.log("User:", process.env.DB_USER)

import productController from './modules/product/product.controller.js'
import  categoryController from './modules/category/category.controller.js'
import orderController from './modules/order/order.controller.js'
import userController from './modules/user/user.controller.js'
import inventoryController from './modules/inventory/inventory.controller.js'
import discountController from './modules/Discount/discount.controller.js'
import promotionController from './modules/promotion/promotion.controller.js'
import { globalErrorHandling } from './utils/response/error.response.js'
import { cleanExpiredPromotions } from "./modules/promotion/services/promotion.service.js"
import { cleanExpiredDiscounts } from "./modules/Discount/services/discount.service.js"


const bootstrap = (app, express) => {
    app.use(express.json())
    
    
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/product", productController)
    app.use("/category", categoryController)
    app.use("/order", orderController)
    app.use("/user", userController)
    app.use("/inventory", inventoryController)
    app.use("/discount", discountController)
    app.use("/promotion",promotionController)
    
    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })
    app.use(globalErrorHandling)
connectionDB()
syncDB()
cleanExpiredPromotions()
cleanExpiredDiscounts()
}
export default bootstrap