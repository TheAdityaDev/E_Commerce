import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/seller/products";

export const fetchSellerProduct = createAsyncThunk(
  "sellerOrder/fetchSellerProduct",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("seller products", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "sellerOrder/createProduct",
  async ({ token, request }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}`, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("create product", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "sellerOrder/updateProduct",
  async ({ token, product, productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/${productId}`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products",
      );
    }
  },
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map((product) => {
          if (product._id === action.payload._id) {
            return action.payload;
          }
          return product;
        });
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default sellerProductSlice.reducer 