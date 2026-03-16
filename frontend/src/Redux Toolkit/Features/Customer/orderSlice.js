import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "./../../../config/api.config";

const initialState = {
  orders: [],
  loading: false,
  error: "",
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
};

const API_URL = "/orders";

export const fetchUSerOrderHistory = createAsyncThunk(
  "orders/fetchUSerOrderHistory",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetch order history", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async ({ token, orderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetch order by id", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  },
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ address, token, paymentGateway }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}`, {
        shippingAddress: address,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          paymentGateway: paymentGateway,
        },
      });
      console.log("create order", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create order");
    }
  },
);

export const fetchOrderItemById = createAsyncThunk(
  "orders/fetchOrderItemById",
  async ({ token, orderItem }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/item/${orderItem}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetch order item by id", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  },
);

// payment success handler
export const paymentSuccess = createAsyncThunk(
  "orders/paymentSuccess",
  async ({ token, paymentId, paymentLinkId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          paymentLinkId: paymentLinkId,
        },
      });
      console.log("fetch order by id", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  },
);

export const cancelOrder = createAsyncThunk(
    "orders/cancelOrder",
    async ({token , orderId }, { rejectWithValue }) =>{
        try {
            const response = await axiosInstance.put(`${API_URL}/${orderId}/cancel`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log("cancel order by id",response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch orders"
            )
        }
    }
)


const orderSlice = createSlice({
    name:"orders",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchUSerOrderHistory.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUSerOrderHistory.fulfilled,(state,action)=>{
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchUSerOrderHistory.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        
        .addCase(fetchOrderById.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderById.fulfilled,(state,action)=>{
            state.loading = false;
            state.currentOrder = action.payload;
        })
        .addCase(fetchOrderById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        
        .addCase(fetchOrderItemById.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderItemById.fulfilled,(state,action)=>{
            state.loading = false;
            state.currentOrder = action.payload;
        })
        .addCase(fetchOrderItemById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })

        .addCase(paymentSuccess.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(paymentSuccess.fulfilled,(state,action)=>{
            state.loading = false;
            state.currentOrder = action.payload;
        })
        .addCase(paymentSuccess.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })

        .addCase(cancelOrder.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(cancelOrder.fulfilled,(state,action)=>{
            state.loading = false;
            state.currentOrder = action.payload;
        })
        .addCase(cancelOrder.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export default orderSlice.reducer