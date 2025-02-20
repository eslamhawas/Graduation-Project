import { lazy } from "react"

const Lazy = {

    Auth : {
        Signup : lazy(()=>import("../page/Auth/Signup/Signup.jsx")),
        Signin : lazy(()=>import("../page/Auth/Signin/Signin.jsx")),
    },
    private :{
        AddProduct : lazy(()=>import("../page/private/AddProduct/AddProduct.jsx")),
        AllProduct : lazy(()=>import("../page/private/AllProduct/AllProduct.jsx"))
    }

}

export default Lazy