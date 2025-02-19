
import imgPageError from "../../../Image/Group 8.webp"
import { useNavigate } from "react-router-dom"
import style from "./Style.module.css"

const {errorButton , pageError} = style

export default function Error() {

  const navigate = useNavigate()


  return (<>

    <div className={pageError}>
      <div>
          <img loading="lazy" src={imgPageError} alt="Error page illustration" />
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3  >We seem to have run into a bit of a problem with this page, <span style={{ color: "#df5e5e" }}>kindly reload.</span></h3>
        <button onClick={() => navigate("/Home")} className={errorButton}  >Go Home</button>

      </div>
    </div>

  </>

  )
}
