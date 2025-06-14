import axiosInstance from "../../../Api/Axios";

export const ApiData = () => {
  const api = {};

  api.transactionData = async (id) => {
    const Data = await axiosInstance.get(
      `nest/api/transactions?vendorId=${id}`
    );
    return Data.data;
  };

  return api;
};
