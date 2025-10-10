import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    auth: localStorage.userToken,
}

const sliceAuthToken = createSlice({
    name: "authToken",
    initialState,
    reducers: {
        setToken(state , action) {
            state.auth = action.payload
        },
        removeToken(state) {
            state.auth = null
        }
    }
})

export const { setToken, removeToken } = sliceAuthToken.actions
export default sliceAuthToken.reducer