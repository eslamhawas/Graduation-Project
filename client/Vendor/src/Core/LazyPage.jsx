import { lazy } from "react"

const Lazy = {

    Auth : {
        Signup : lazy(()=>import("../page/Auth/Signup/Signup")),
        Signin : lazy(()=>import("../page/Auth/Signin/Signin")),
    },
    private :{
    AllProduct :  lazy(() => import("../page/private/AllProduct/AllProduct")),
     AddProduct :  lazy(() => import("../page/private/AllProduct/AddProduct")),
     MyProducts: lazy(() => import("../page/private/AllProduct/MyProducts")),
     AddProductMe :   lazy(() => import("../page/private/AllProduct/AddProductMe")),
    }

}

export default Lazy