import axios from "axios";
import store from "../page/Redux/Store";
import { removeToken } from "../page/Redux/Auth";
const apiUrl = import.meta.env.VITE_PATH_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers:{},
})

export default axiosInstance