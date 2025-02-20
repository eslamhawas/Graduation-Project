import { lazy } from "react"

const Lazy = {
    Public : {
       Home : lazy(()=>import("../page/Public/Home/Home.jsx")) ,
       Contact : lazy(()=>import("../page/Public/Contact/Contact.jsx")) ,
       About : lazy(()=>import("../page/Public/About/About.jsx")) ,
    },
    Auth : {
        Signup : lazy(()=>import("../page/Auth/Signup/Signup.jsx")),
        Signin : lazy(()=>import("../page/Auth/Signin/Signin.jsx")),
    },
    private :{
        
    }

}

export default Lazy