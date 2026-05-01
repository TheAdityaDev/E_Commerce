import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";
import secureLocalStorage from "react-secure-storage";

const API_URL = "/products";

const initialState = {
  product: null,
  products: [],
  loading: false,
  error: null,
  searchProduct: [],
  totalElements: 0,
  totalPages: 0,
};

export const fetchProductById = createAsyncThunk(
  "/products/fetchProductById",
  async (productId, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${productId}`, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
        },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return rejectWithValue("Request canceled");
      }

      return rejectWithValue(error.response?.data || "Failed to fetch product");
    }
  },
);

export const searchProduct = createAsyncThunk(
  "/products/searchProduct",
  async (query, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/search`, {
        params: { query },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return rejectWithValue("Request canceled");
      }

      return rejectWithValue(error.response?.data || "Failed to fetch product");
    }
  },
);

export const getAllProducts = createAsyncThunk(
  "/products/getAllProducts",
  async (params, { rejectWithValue, getState, signal }) => {
    try {
      const { products } = getState();

      if (products.loading) return;

      const response = await axiosInstance.get(`${API_URL}`, {
        params: {
          ...params,
          page: params?.pageNumber || 1,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
        },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return rejectWithValue("Request canceled");
      }

      return rejectWithValue(
        error.response?.data || "Failed to fetch products",
      );
    }
  },
);

export const filterProducts = createAsyncThunk(
  "/products/filterProducts",
  async (params, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`, {
        params: {
          ...params,
          page: params.pageNumber || 0,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
        },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return rejectWithValue("Request canceled");
      }

      return rejectWithValue(
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
        // store single fetched product in `product` to avoid mixing list vs single
        state.product = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      })

      .addCase(searchProduct.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        // ✅ store current query
        state.currentQuery = action.meta.arg;
      })

      .addCase(searchProduct.fulfilled, (state, action) => {
        // ✅ only update if it's latest query
        if (state.currentQuery === action.meta.arg) {
          state.loading = false;
          state.searchResults = action.payload;
        }
      })

      .addCase(searchProduct.rejected, (state, action) => {
        if (state.currentQuery === action.meta.arg) {
          state.loading = false;
          state.error = action.error.message || "Failed to fetch product";
        }
      })

      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(filterProducts.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload || {};

        state.products = payload.content || [];
        state.totalElements = payload.totalElements || 0;
        state.totalPages = payload.totalPages || 0;
      })

      .addCase(getAllProducts.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch product";
      })

      .addCase(filterProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload || {};

        state.products = payload.content || [];
        state.totalElements = payload.totalElements || 0;
        state.totalPages = payload.totalPages || 0;
      })

      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export default productSlice.reducer;
