import axios from "axios";
import store from "../page/Redux/Store";
import { removeToken } from "../page/Redux/Auth";
const apiUrl = import.meta.env.VITE_PATH_URL;

const axiosInstance = axios.create({
<<<<<<< HEAD
    baseURL: apiUrl,
    headers:{},
})

export default axiosInstance
=======
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json"
  }
});



axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 500)
    ) {
      window.location.href = "/Signin";
      localStorage.removeItem("userToken");
      store.dispatch(removeToken());
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
>>>>>>> 3befb8ebdacc5ac6db819ee9113137257477d3c0
