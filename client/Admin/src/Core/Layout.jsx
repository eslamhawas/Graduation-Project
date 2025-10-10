
import { useNavigate } from "react-router"
import Sidbar from "../page/private/Header/Sidbar"
import  Footer  from "../page/private/Footer/Footer"
import Header from "../page/private/Header/Header"
import { useDispatch } from "react-redux"
import { removeToken } from "../page/Redux/Auth"




function Layout() {
  const navigate = useNavigate()
  const sliceAuthToken = useDispatch()


  const handleLogout = () => {
    localStorage.removeItem("userToken")
    sliceAuthToken(removeToken())
    navigate("/Signin")
    
  };

  return (
    <>
      <Header handleLogout={()=>handleLogout()}  />

      <Sidbar />

      <Footer />
    </>
  )
}

export default Layout
