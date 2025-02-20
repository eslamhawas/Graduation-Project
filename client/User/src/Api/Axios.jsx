import axios from "client/User/src/Api/Axios.jsx";

const axiosInstance = axios.create({
    baseURL: window.config.apiUrl,
    headers:"",
})

export default axiosInstance