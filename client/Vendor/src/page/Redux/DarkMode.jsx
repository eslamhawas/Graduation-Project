import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dark: true,
}

const sliceDarkMode = createSlice({
    name: "darkMode",
    initialState,
    reducers: {
        darkMode(state) {
            state.dark = false
        },
        lightMode(state) {
            state.dark = true
        }
    }
})

export const { darkMode, lightMode } = sliceDarkMode.actions
export default sliceDarkMode.reducer