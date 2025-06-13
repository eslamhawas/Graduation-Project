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
    const offset= (page -1)* size
    const count = await model.count({ where: filter })
    const result = await model.findAll({
        where: filter,
        attributes: select ? select.split(" ") : undefined,
        offset,
        limit: size,
        include: populate.length ? populate : undefined
    });
    return { count, page, size, result}
}
