import { createBrowserRouter } from "react-router-dom";
import Error from "../page/Auth/ErrorPage/Error";
import Layout from "./Layout";
import Lazy from "./LazyPage";
import { ProtectedRoutes } from "./Config";

const Routers = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: "",
        children: [
            { index: true, element:(<Lazy.private.AllProduct /> ) },
            {
                path: "/AllProducts",
                element:<Lazy.private.AllProduct /> 
            },
            {
                path: "/AddProduct/:id?",
                element:<Lazy.private.AddProduct />
            },

        ]

    },
    {
        path: "/signin",
        element: <Lazy.Auth.Signin />
    },
    {
        path: "/Signup",
        element: <Lazy.Auth.Signup />
    },

    {
        path: "*",
        element: <Error />
    }
])

export default Routers