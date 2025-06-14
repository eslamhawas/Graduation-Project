import axiosInstance from "../../Api/Axios"

export const ApiAuth = ()=>{
  const api = {}

   api.Register =async (data) => {
    const Data = await axiosInstance.post(`/api/v1/auth?role=user` , data)
  
    return Data.data
  }

  api.Login = async (data) => {
    try {
      const response = await axiosInstance.post(`/api/v1/auth/login?role=USER`, data);
      return response;    
    } catch (error) {
      return {
        status: error.response?.status || 500,
        error: error.response?.data?.message || "Something went wrong",
      };
    }
  };



  return api
}