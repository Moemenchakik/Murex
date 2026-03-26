import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

const initialState = {
  wishlistItems: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getWishlist = createAsyncThunk(
  "wishlist/getAll",
  async (_, thunkAPI) => {
    try {
      return await authService.getWishlist();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, thunkAPI) => {
    try {
      return await authService.addToWishlist(productId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, thunkAPI) => {
    try {
      return await authService.removeFromWishlist(productId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.wishlistItems = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isSuccess = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isSuccess = true;
        // We'll refetch or manually update locally
      });
  },
});

export const { reset } = wishlistSlice.actions;
export default wishlistSlice.reducer;
