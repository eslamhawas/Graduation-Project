import { createBrowserRouter } from "react-router-dom";
import Error from "../page/Auth/ErrorPage/Error.jsx";
import  Layout  from "./Layout.jsx";
import Lazy from "./LazyPage.jsx";

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
        }
    ]

},
{
    path: "*",
    element: <Error />
}
])

export default Routers