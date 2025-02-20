import { configureStore } from "@reduxjs/toolkit";
import sliceDarkMode from "./DarkMode.jsx"

const store = configureStore({
    reducer: {
        sliceDarkMode
    }
})

export default store