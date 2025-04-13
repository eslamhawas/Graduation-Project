import { configureStore } from "@reduxjs/toolkit";
import sliceDarkMode from "./DarkMode"

const store = configureStore({
    reducer: {
        sliceDarkMode
    }
})

export default store