import axiosInstance from "../../Api/Axios"

export const ApiAuth = ()=>{
  const api = {}

   api.Register =async (data) => {
    const Data = await axiosInstance.post(`api/v1/auth/signup?role=vendor` , data)
    return Data
  }

  return api
}