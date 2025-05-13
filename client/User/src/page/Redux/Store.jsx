import { configureStore } from "@reduxjs/toolkit";
<<<<<<< HEAD
import sliceAuthToken from "./Auth";

const store = configureStore({
  reducer: {
    sliceAuthToken
=======
import sliceDarkMode from "./DarkMode";

const store = configureStore({
  reducer: {
    sliceDarkMode
>>>>>>> 0197d0dac8e5ed7d8c9f376d951012dc977311e9
  }
});

export default store;
