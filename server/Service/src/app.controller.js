import { connectionDB } from './DB/connection.js'
import path from "node:path"
import dotenv from 'dotenv'
dotenv.config({path : path.resolve("./src/config/.env.dev")})
import productController from './modules/product/product.controller.js'
import { globalErrorHandling } from './utils/response/error.response.js'


const bootstrap = (app, express) => {
    app.use(express.json())
    
    
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/product", productController)
    
    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })
    app.use(globalErrorHandling)
connectionDB()

}



export default bootstrap