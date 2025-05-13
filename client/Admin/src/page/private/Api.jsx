import axiosInstance from "../../Api/Axios";

export const ApiData = () => {
  const api = {};

  api.AllUser = async () => {
    const Data = await axiosInstance.get(
      `api/v1/users?status=ACTIVE&role=USER`
    );
    return Data.data;
  };

  api.BinUser = async (id) => {
    const Data = await axiosInstance.patch(`api/v1/admins/users/${id}/ban`);
    return Data.data;
  };

  api.AllVendor = async () => {
    const Data = await axiosInstance.get(
      `api/v1/users?status=ACTIVE&role=VENDOR`
    );
    return Data.data;
  };

  api.AllAdmin = async () => {
    const Data = await axiosInstance.get(
      `api/v1/users?status=ACTIVE&role=ADMIN`
    );
    return Data.data;
  };
   api.AllBin = async () => {
    const Data = await axiosInstance.get(
      `api/v1/users?status=SUSPENDED`
    );
    return Data.data;
  };
   api.UnBan = async (id) => {
    const Data = await axiosInstance.patch(
      `api/v1/admins/users/${id}/unban`
    );
    return Data.data;
  };

     api.promoteAdmin = async (id) => {
    const Data = await axiosInstance.patch(
      `api/v1/admins/users/${id}/role/admin`
    );
    
    return Data.data;
  };

       api.ConvertUser = async (id) => {
    const Data = await axiosInstance.delete(
      `api/v1/admins/users/${id}/role/admin`
    );
    return Data.data;
  };

   api.PendingVendor = async () => {
    const Data = await axiosInstance.get(
      `api/v1/users?status=PENDING_VERIFICATION`
    );
    return Data.data;
  };

     api.ConfirmVendor = async (id) => {
    const Data = await axiosInstance.patch(
      `api/v1/admins/vendors/${id}/status?status=ACTIVE`
    );
    return Data.data;
  };

  return api;
};
