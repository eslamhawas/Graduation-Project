import { createBrowserRouter } from "react-router-dom";
import Error from "../page/Auth/ErrorPage/Error";
import Layout from "./Layout";
import Lazy from "./LazyPage";
import { ProtectedRoutes } from "./Config";

const Routers = createBrowserRouter([
    {
        path: "/",
        element:<ProtectedRoutes><Layout /></ProtectedRoutes> ,
        errorElement: "",
        children: [
            { index: true, element:(<ProtectedRoutes> <Lazy.private.AllUser /></ProtectedRoutes> ) },
            {
                path: "/AllUser",
                element:<ProtectedRoutes> <Lazy.private.AllUser /> </ProtectedRoutes>
            },
            {
                path: "/AllVendors",
                element: <ProtectedRoutes><Lazy.private.AllVendors /></ProtectedRoutes> 
            },
                        {
                path: "/BannedUsers",
                element: <ProtectedRoutes><Lazy.private.BinUser /></ProtectedRoutes> 
            },
                        {
                path: "/AllAdmin",
                element: <ProtectedRoutes><Lazy.private.AllAdmin /></ProtectedRoutes> 
            },
                                    {
                path: "/PendingVendors",
                element: <ProtectedRoutes><Lazy.private.PendingVendors /></ProtectedRoutes> 
            },
                                    {
                path: "/AllProduct",
                element: <ProtectedRoutes><Lazy.private.AllProduct /></ProtectedRoutes> 
            },


                                                {
                path: "/AddProduct/:id",
                element: <ProtectedRoutes><Lazy.private.AddProduct /></ProtectedRoutes> 
            },

                                                            {
                path: "/MyProducts",
                element: <ProtectedRoutes><Lazy.private.MyProducts /></ProtectedRoutes> 
            },

                                                            {
                path: "/AddProductMe",
                element: <ProtectedRoutes><Lazy.private.AddProductMe /></ProtectedRoutes> 
            },
                                                            {
                path: "/UpdateProductMe/:id",
                element: <ProtectedRoutes><Lazy.private.AddProductMe /></ProtectedRoutes> 
            },

            


            

            
        ]

    },
    {
        path: "/signin",
        element: <Lazy.Auth.Signin />
    },

    {
        path: "*",
        element: <Error />
    }
])

export default Routers