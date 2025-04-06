import axios from "axios";

const axiosInstance = axios.create({
    baseURL: window.config.apiUrl,
    headers:"",
})

export default axiosInstance