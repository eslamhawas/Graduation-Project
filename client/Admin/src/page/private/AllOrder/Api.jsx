import axiosInstance from "../../../Api/Axios";

export const ApiData = () => {
  const api = {};

  api.AllOrder = async () => {
    const Data = await axiosInstance.get(
      `nest/api/order-items/for-provider`
    );
    return Data.data;
  };

    api.ConfirmOrder = async (id , body) => {
    const Data = await axiosInstance.patch(`nest/api/order-items/${id}` , body);
    return Data.data;
  };
  api.DelateOrder = async (id) => {
    const Data = await axiosInstance.delete(
      `nest/api/order-items/${id}`
    );
    return Data.data;
  };


  return api;
};
