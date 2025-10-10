import axiosInstance from "../../../Api/Axios";

export const ApiData = () => {
  const api = {};

  api.transactionData = async (page , take) => {
    const Data = await axiosInstance.get(
      `nest/api/transactions?take=${take}&page=${page}`
    );
    return Data.data;
  };

  return api;
};
