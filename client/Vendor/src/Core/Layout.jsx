
import { useNavigate } from "react-router"
import { useState } from "react"
import Sidbar from "../page/private/Header/Sidbar"
import  Footer  from "../page/private/Footer/Footer"
import Header from "../page/private/Header/Header"




function Layout() {
  const navigate = useNavigate()
  const [tokenUser, setTokenUser] = useState(() => localStorage.getItem("userToken"))

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    setTokenUser(null)
    navigate("/Signin")
  };

  return (
    <>
      <Header handleLogout={handleLogout} tokenUser={tokenUser} />

      <Sidbar />

      <Footer />
    </>
  )
}

export default Layout
