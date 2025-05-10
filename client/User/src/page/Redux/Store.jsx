import { configureStore } from "@reduxjs/toolkit";
import sliceAuthToken from "./Auth";

const store = configureStore({
  reducer: {
    sliceAuthToken
  }
});

export default store;
