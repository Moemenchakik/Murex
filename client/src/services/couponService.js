import api from "./api/axios";

export const validateCoupon = async (code) => {
  const response = await api.post("/coupons/validate", { code });
  return response.data;
};

export const getCoupons = async () => {
  const response = await api.get("/coupons");
  return response.data;
};

export const createCoupon = async (couponData) => {
  const response = await api.post("/coupons", couponData);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupons/${id}`);
  return response.data;
};