
import { Outlet, useNavigate } from "react-router"
import Footer from "../page/Public/Footer/Footer"
import Header from "../page/Public/Header/Header"
import { Suspense, useCallback, useState } from "react"



function Layout() {
  const navigate = useNavigate()
  const [tokenUser, setTokenUser] = useState(() => localStorage.getItem("userToken"))

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    setTokenUser(null)
    navigate("/Home")
  };

  return (
    <>
      <Header handleLogout={handleLogout} tokenUser={tokenUser} />

      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>

      <Footer />
    </>
  )
}

export default Layout
