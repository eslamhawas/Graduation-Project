import { configureStore } from "@reduxjs/toolkit";
import sliceAuthToken from "./Auth";
import sliceDarkMode from "./DarkMode";
import  { CartReducer } from "./CartReducer"

const store = configureStore({
  reducer: {

    sliceDarkMode,
    sliceAuthToken,
    CartReducer

  }
});

export default store;

 