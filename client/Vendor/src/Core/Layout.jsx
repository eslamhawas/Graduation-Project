
import { useNavigate } from "react-router"
import { useState } from "react"
import Sidbar from "../page/private/Header/Sidbar.jsx"
import  Footer  from "../page/private/Footer/Footer.jsx"
import Header from "../page/private/Header/Header.jsx"




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
