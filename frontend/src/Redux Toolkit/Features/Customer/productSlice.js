import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/products";

const initialState = {
  product: null,
  products: [],
  loading: false,
  error: null,
  searchProduct: [],
};

export const fetchProductById = createAsyncThunk(
  "/products/fetchProductById",
  async (productId, { rejectedWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${productId}`);
      console.log("Product by id :", response.data);
      return response.data;
    } catch (error) {
      return rejectedWithValue(
        error.response?.data || "Failed to fetch product",
      );
    }
  },
);

export const searchProduct = createAsyncThunk(
  "/products/searchProduct",
  async (query, { rejectedWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/search`, {
        params: {
          query,
        },
      });
      console.log("Search by id :", response.data);
      return response.data;
    } catch (error) {
      return rejectedWithValue(
        error.response?.data || "Failed to fetch product",
      );
    }
  },
);

export const getAllProducts = createAsyncThunk(
  "/products/getAllProducts",
  async (params, { rejectedWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`, {
        params: {
          ...params,
          page: params.pageNumber || 0,
          limit: 10,
        },
      });
      console.log("All products :", response.data);
      return response.data;
    } catch (error) {
      return rejectedWithValue(
        error.response?.data || "Failed to fetch products",
      );
    }
  },
);

const productSlice = createSlice({
    name: "products",
    initialState, // ✅ fixed spelling
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProductById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
  
        .addCase(fetchProductById.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload;
        })
  
        .addCase(fetchProductById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to fetch product";
        })
  
        .addCase(searchProduct.pending, (state) => {
          state.loading = true;
          state.error = null;
        });
    },
  });

export default productSlice.reducer