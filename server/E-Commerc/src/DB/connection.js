import  {Sequelize} from "sequelize"
export const sequelize =new Sequelize('pg','root','', {host:'127.0.0.1',dialect:'mysql'})
export const connectionDB= async ()=>{
    await sequelize.authenticate().then(res=>{
        console.log(" connect to DB");
        
    }).catch(err=>{
        console.error("fail to connect ");
        
    })
}
export const syncDB= async()=>{
    await sequelize.sync({alter: false}).then(res=>{
        console.log(" connect to DB");

    }).catch(err=>{
        console.log(err);
        console.error("fail to connect ");
        
    })
}






