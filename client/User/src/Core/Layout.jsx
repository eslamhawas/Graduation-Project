
import { Outlet, useNavigate } from "react-router"
import Footer from "../page/Public/Footer/Footer"
import Header from "../page/Public/Header/Header"
import { Suspense } from "react"
import { useDispatch } from "react-redux"
import { removeToken } from "../page/Redux/Auth"


function Layout() {
  const navigate = useNavigate()
  const sliceAuthToken = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    sliceAuthToken(removeToken())
    navigate("/Home")
  };

  return (
    <>
      <Header handleLogout={handleLogout}  />

      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>

      <Footer />
    </>
  )
}

export default Layout
