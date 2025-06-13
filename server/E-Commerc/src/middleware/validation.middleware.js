import joi from "joi";

export const  validation = (schema) =>{
    return (req, res, next) =>{
    const inputData ={...req.body, ...req.query, ...req.params  }
    console.log("inputData:", inputData);

    if (req.file || req.files?.length) {
        inputData.file ={...req.file, ...req.files}
    }
    const validationResult = schema.validate(inputData,{abortEarly:false})
    if (validationResult.error) {
        return res.status(400).json({message: "validation error", details: validationResult.error.details})
    }
    return next()
}
}