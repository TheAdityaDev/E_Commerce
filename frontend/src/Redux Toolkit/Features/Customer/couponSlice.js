import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/coupon";

export const applyCoupon = createAsyncThunk(
  "/coupon/applyCoupon",
  { apply: String, code: String, orderValue: Number, token: String },
  async ({ apply, code, orderValue, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/apply`, null, {
        apply,
        code,
        orderValue,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("apply coupon", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to apply coupon");
    }
  },
);

const  initialState = {
    coupon:null,
    loading:false,
    error:null
}

const couponSlice = createSlice({
    name:'coupon',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(applyCoupon.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(applyCoupon.fulfilled,(state,action)=>{
            state.loading = false;
            state.coupon = action.payload;

            if (action.meta.arg.apply === "true") {
                state.couponApplied = true
            }
        })
        .addCase(applyCoupon.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message || "Failed to apply coupon";
            state.couponApplied = false
        })
    }
})


export default couponSlice.reducer