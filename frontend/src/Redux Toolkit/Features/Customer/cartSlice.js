import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const API_URL = "/cart";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetch cart", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  },
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (token, request, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/add`, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("add cart item", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  },
);
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ token, cartItemId, cartItem }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/item/${cartItemId}`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("update cart", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update cart");
    }
  },
);
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (token, cartItemId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/item/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("delete item cart", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        if(state.cart){
          state.cart.cartItems.push(action.payload)
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
          const index = state.cart.cartItems.findIndex((item)=>item._id === action.payload._id)
          
          if(index !== -1){
            state.cart.cartItems[index] = action.payload
          }
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart) {
            state.cart.cartItems = state.cart.cartItems.filter((item)=>item._id !== action.payload._id)   
        }
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;