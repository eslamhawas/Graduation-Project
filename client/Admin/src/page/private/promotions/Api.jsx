import axiosInstance from "../../../Api/Axios";

export const ApiData = () => {
  const api = {};

  api.AllProduct = async (size ,page ) => {
    const Data = await axiosInstance.get(`spring/api/v1/promotions?page=${size}&size=${page}`);
    return Data.data;
  };

    api.AllProducts = async () => {
    const Data = await axiosInstance.get(
      `nest/api/products/all-products/for-admin`
    );
    return Data.data;
  };

  api.MyProducts = async () => {
    const Data = await axiosInstance.get(
      `nest/api/products/all-products/for-provider`
    );
    return Data.data;
  };

  api.DelateProduct = async (id) => {
    const Data = await axiosInstance.delete(`spring/api/v1/promotions/${id}`);
    return Data.data;
  };

  api.getCategories = async () => {
    const Data = await axiosInstance.get(`nest/api/category`);
    return Data.data;
  };

  api.getBrands = async () => {
    const Data = await axiosInstance.get(`nest/api/brand`);
    return Data.data;
  };

  api.AddProduct = async (Body, id) => {
    const Data = await axiosInstance.patch(`nest/api/products/${id}`, Body);
    return Data.data;
  };

  api.AddProductMe = async (Body) => {
    const Data = await axiosInstance.post(`nest/api/products`, Body);
    return Data.data;
  };

  api.UpdateProductMe = async (Body, id) => {
    const Data = await axiosInstance.patch(
      `nest/api/products/${id}/product-providers/update`,
      Body
    );
    return Data.data;
  };

  api.GetProductById = async (id) => {
    const Data = await axiosInstance.get(`nest/api/products/${id}`);
    return Data.data;
  };

  api.AddImg = async (Body, id) => {
    const Data = await axiosInstance.patch(`nest/api/products/${id}`, Body);
    return Data.data;
  };

      api.promotionPercentage = async (Body) => {
    const Data = await axiosInstance.post(
      `spring/api/v1/promotions` , Body
    );
    return Data.data;
  };

        api.GetProfitMargin = async () => {
    const Data = await axiosInstance.get(
      `spring/api/v1/commission/last` 
    );
    return Data.data;
  };

  return api;
};
