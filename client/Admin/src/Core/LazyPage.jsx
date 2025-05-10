import { lazy } from "react"

const Lazy = {

    Auth : {
        Signin : lazy(()=>import("../page/Auth/Signin/Signin")),
    },
    private :{
        AddProduct : lazy(()=>import("../page/private/AddProduct/AddProduct")),
        AllProduct : lazy(()=>import("../page/private/AllProduct/AllProduct"))
    }

}

export default Lazy