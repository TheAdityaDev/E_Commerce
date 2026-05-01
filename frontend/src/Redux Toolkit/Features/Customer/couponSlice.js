import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";
import { toast } from "react-toastify";

const API_URL = "/coupon";

export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async ({ apply, code, orderValue, token }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/apply`,
        { apply, code, orderValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
          timeout: 10000 
        }
      );

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return rejectWithValue("Request canceled");
      }

      const message = error?.response?.data?.message || "Failed to apply coupon";
      toast.info(message);
      return rejectWithValue(error?.response?.data || message);
    }
  }
);

const initialState = {
  coupon: null,
  loading: false,
  error: null,
  couponApplied: false,
  appliedCode: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCoupon(state) {
      state.coupon = null;
      state.couponApplied = false;
      state.appliedCode = null;
      state.error = null;
    },
  },
    extraReducers:(builder)=>{
        builder.addCase(applyCoupon.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(applyCoupon.fulfilled, (state, action) => {
          state.loading = false;
          state.coupon = action.payload;

          if (action.meta.arg.apply) {
            state.couponApplied = true;
            state.appliedCode = action.meta.arg.code;
          }
        })
        .addCase(applyCoupon.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message || "Failed to apply coupon";
            state.couponApplied = false
        })
    }
})


export const { clearCoupon } = couponSlice.actions;

export default couponSlice.reducer