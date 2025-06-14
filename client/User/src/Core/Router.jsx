import { createBrowserRouter } from "react-router-dom";
import Error from "../page/Auth/ErrorPage/Error";
import  Layout  from "./Layout";
import Lazy from "./LazyPage";
import {ProtectedRoutes} from "./Config"

const Routers = createBrowserRouter([
{
    path:"/",
    element:<Layout />,
    errorElement : "",
    children : [
        {index:true , element : <Lazy.Public.Home /> },
        {
            path:"/Home",
            element : <Lazy.Public.Home />
        },
        {
            path:"/Contact",
            element: <Lazy.Public.Contact />
        },
        {
            path:"/About",
            element: <Lazy.Public.About />
        },
        {
           path:"/Signup",
           element : <Lazy.Auth.Signup />
        },
        {
            path:"/signin",
            element : <Lazy.Auth.Signin />
        },

        {
            path: "/category/:id",
            element: <Lazy.Public.CategoryProducts />
          },
    
       {
            path: "/products/:id/provider/:providerId",
            element:<ProtectedRoutes><Lazy.Public.ProductDetails /></ProtectedRoutes> 
          },

       {
        path: "/account",
        element: <Lazy.Public.Account />
      },
      {
        path: "/cart",
       element:<ProtectedRoutes><Lazy.Public.Cart /></ProtectedRoutes> 
      },
      /**
       * ADD ORDER-DETAILS PAGE
       */
      {
        path: "/order/:id?",
       element:<ProtectedRoutes><Lazy.Public.Order /></ProtectedRoutes> 
      },
    ]

},
{
    path: "*",
    element: <Error />
}
])

export default Routers