import api from "./api/axios";

export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("coupon");
};

export const updateUser = async (userData) => {
  const response = await api.put("/auth/profile", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get("/auth/wishlist");
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await api.post("/auth/wishlist", { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/auth/wishlist/${productId}`);
  return response.data;
};