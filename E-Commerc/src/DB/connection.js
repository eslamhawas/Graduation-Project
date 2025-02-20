import mongoose from "mongoose";
export const connectionDB = ()=>{
    return mongoose.connect(process.env.DB_URI).then(res =>{
        console.log("connected DB");
        
    }).catch(error =>{
        console.error("fail to connect DB");
        
    })
}