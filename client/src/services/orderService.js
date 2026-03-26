import api from "./api/axios";

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getOrderDetails = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};