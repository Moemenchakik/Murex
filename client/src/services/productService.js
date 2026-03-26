import api from "./api/axios";

export const getAllProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getSingleProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};