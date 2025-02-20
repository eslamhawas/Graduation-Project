import mongoose, { model, Schema, Types } from "mongoose";
const productSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required: true,
    },
    color:{
        type: String,
    },
    attachments: [{secure_url:String, public_id: String}],
    isAccept:{
        type:Boolean,
        default:true
    },
    quantity:{
        type: Number,
    },
    category:{ type: Types.ObjectId, ref:"Category"  },

    length: Number,
    width:Number,
    
},{timestamps:true})

const productModel = mongoose.models.Product || model("Product", productSchema)

export default productModel