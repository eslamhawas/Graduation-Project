import { lazy } from "react"

const Lazy = {
    Public : {
       Home : lazy(()=>import("../page/Public/Home/Home")) ,
       Contact : lazy(()=>import("../page/Public/Contact/Contact")) ,
       About : lazy(()=>import("../page/Public/About/About")) ,
       CategoryProducts: lazy(() => import("../page/Public/Home/CategoryProducts")),
       ProductDetails: lazy(() => import("../page/Public/Home/ProductDetails")),
       Account: lazy(() => import("../page/Public/Profile/Account")),
       Cart: lazy(() => import("../page/Public/Cart/cart")),
       Order: lazy(() => import("../page/Public/Order/Order")),

    },
    Auth : {
        Signup : lazy(()=>import("../page/Auth/Signup/Signup")),
        Signin : lazy(()=>import("../page/Auth/Signin/Signin")),
    },
    private :{
        
    }

}

export default Lazy