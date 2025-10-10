import { configureStore } from "@reduxjs/toolkit";
import sliceDarkMode from "./DarkMode"
import sliceAuthToken from "./Auth"

const store = configureStore({
    reducer: {
        sliceDarkMode,
        sliceAuthToken
    }
})

export default store