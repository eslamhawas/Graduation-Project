import axios from "client/Vendor/src/Api/Axios.jsx";

const axiosInstance = axios.create({
    baseURL: window.config.apiUrl,
    headers:"",
})

export default axiosInstance