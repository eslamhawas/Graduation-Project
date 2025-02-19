import { lazy } from "react"

const Lazy = {
    Public : {
       Home : lazy(()=>import("../page/Public/Home/Home")) ,
       Contact : lazy(()=>import("../page/Public/Contact/Contact")) ,
       About : lazy(()=>import("../page/Public/About/About")) ,
    },
    Auth : {
        Signup : lazy(()=>import("../page/Auth/Signup/Signup")),
        Signin : lazy(()=>import("../page/Auth/Signin/Signin")),
    },
    private :{
        
    }

}

export default Lazy