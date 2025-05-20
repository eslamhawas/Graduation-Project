import { configureStore } from "@reduxjs/toolkit";
import sliceAuthToken from "./Auth";
import sliceDarkMode from "./DarkMode";

const store = configureStore({
  reducer: {
<<<<<<< HEAD
    sliceAuthToken
=======
    sliceDarkMode,
    sliceAuthToken

>>>>>>> 3befb8ebdacc5ac6db819ee9113137257477d3c0
  }
});

export default store;

 