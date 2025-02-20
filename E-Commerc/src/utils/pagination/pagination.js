
export const pagination = async({
    page= process.env.PAGE,
    size= process.env.SIZE,
    filter ={},
    model,
    populate=[],
    select= ""}
    ={})=>{
    page = parseInt(parseInt(page) <1 ? 1 : page)
    size =parseInt(parseInt(size) <1 ? 1 : size)
    const skip= (page -1)* size
    const count = await model.find(filter).countDocuments()
    const result =  await model.find(filter)
        .select(select)
        .skip(skip)
        .limit(size)
        .populate(populate);
    return { count, page, size, result}
}
