import axios from "axios";

const apiUrl = import.meta.env.VITE_PATH_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers:"",
})

export default axiosInstance