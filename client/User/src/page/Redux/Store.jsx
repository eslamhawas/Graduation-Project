import { configureStore } from "@reduxjs/toolkit";
import sliceAuthToken from "./Auth";
import sliceDarkMode from "./DarkMode";

const store = configureStore({
  reducer: {
    sliceDarkMode,
    sliceAuthToken

  }
});

export default store;
