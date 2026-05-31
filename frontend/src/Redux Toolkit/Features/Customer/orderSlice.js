import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "./../../../config/api.config";
import { toast } from "react-toastify";

const initialState = {
  orders: [],
  loading: false,
  error: "",
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
};

const API_URL = "/order";

export const fetchUserOrderHistory = createAsyncThunk(
  "orders/fetchUserOrderHistory",
  async (token, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") return rejectWithValue("Request canceled");

      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async ({ token, orderId }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") return rejectWithValue("Request canceled");

      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    { address, token, paymentGateway, discount, couponCode },
    { rejectWithValue, signal },
  ) => {
    try {
      const response = await axiosInstance.post(
        API_URL,
        {
          shippingAddress: address,
          couponDiscount: discount || 0,
          couponCode: couponCode || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { paymentGateway },
          signal,
          timeout: 10000,
        }
      );

      if (response.status === 200) toast.success(response.data.message);

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") return rejectWithValue("Request canceled");
      const message = error.response?.data?.message || "Failed to create order";
      toast.error(message);
      return rejectWithValue(error.response?.data || message);
    }
  }
);

export const fetchOrderItemById = createAsyncThunk(
  "orders/fetchOrderItemById",
  async ({ token, orderItem }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/item/${orderItem}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") return rejectWithValue("Request canceled");

      return rejectWithValue(error.response?.data || "Failed to fetch order item");
    }
  }
);

// payment success handler
export const paymentSuccess = createAsyncThunk(
  "orders/paymentSuccess",
  async (
    { token, paymentId, paymentLinkId, paymentOrderId },
    { rejectWithValue, signal },
  ) => {
    try {
      const response = await axiosInstance.get(`/payment/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { paymentLinkId, paymentOrderId },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") return rejectWithValue("Request canceled");

      return rejectWithValue(error.response?.data || "Failed to fetch order payment");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ token, orderId }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
          timeout: 10000,
        }
      );
      
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") return rejectWithValue("Request canceled");

      return rejectWithValue(error.response?.data || "Failed to cancel order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrderItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(paymentSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentSuccess.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(paymentSuccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
