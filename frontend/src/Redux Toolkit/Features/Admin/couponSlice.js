import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/coupon";

const initialState = {
  coupons: [],
  currentCoupon: null,
  loading: false,
  error: null,
  success: false,
};

export const createCoupon = createAsyncThunk(
  "/coupon/createCoupon",
  async ({ token, values }, { rejectWithValue, signal }) => {
    try {
      const couponData = {
        code: values.code,
        discountPercentage: values.discountPercentage,
        validityStartDate: values.validityStartDate,
        validityExpireDate: values.validityExpireDate,
        minimumOrderValue: values.minimumValue,
        description: values.description || "",
      };

      const response = await axiosInstance.post(
        `${API_URL}/create`,
        couponData,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
          timeout: 10000,
        },
      );

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED")
        return rejectWithValue("Request canceled");
      return rejectWithValue(error.response?.data || "Failed to create coupon");
    }
  },
);

export const fetchAllCoupon = createAsyncThunk(
  "/coupon/fetchAllCoupon",
  async ({ token }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED")
        return rejectWithValue("Request canceled");
      return rejectWithValue(error.response?.data || "Failed to fetch coupons");
    }
  },
);

export const getCouponById = createAsyncThunk(
  "/coupon/getCouponById",
  async ({ id, token }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED")
        return rejectWithValue("Request canceled");
      return rejectWithValue(error.response?.data || "Failed to fetch coupon");
    }
  },
);

export const deleteCoupon = createAsyncThunk(
  "/coupon/deleteCoupon",
  async ({ id, token }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
      });

      return { id, ...response.data };
    } catch (error) {
      if (error.code === "ERR_CANCELED")
        return rejectWithValue("Request canceled");
      return rejectWithValue(error.response?.data || "Failed to delete coupon");
    }
  },
);

export const updateCoupon = createAsyncThunk(
  "/coupon/updateCoupon",
  async ({ id, token, values }, { rejectWithValue, signal }) => {
    try {
      const couponData = {
        code: values.code,
        discountPercentage: values.discountPercentage,
        validityStartDate: values.validityStartDate,
        validityExpireDate: values.validityExpireDate,
        minimumOrderValue: values.minimumValue,
        description: values.description || "",
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      const response = await axiosInstance.put(`${API_URL}/${id}`, couponData, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED")
        return rejectWithValue("Request canceled");
      return rejectWithValue(error.response?.data || "Failed to update coupon");
    }
  },
);

export const toggleCouponStatus = createAsyncThunk(
  "/coupon/toggleCouponStatus",
  async ({ id, token }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/${id}/status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
          timeout: 10000,
        },
      );

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED")
        return rejectWithValue("Request canceled");
      return rejectWithValue(
        error.response?.data || "Failed to toggle coupon status",
      );
    }
  },
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearCurrentCoupon: (state) => {
      state.currentCoupon = null;
    },
  },
  extraReducers: (builder) => {
    // Create Coupon
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupons.push(action.payload.coupon);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create coupon";
        state.success = false;
      });

    // Fetch All Coupons
    builder
      .addCase(fetchAllCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // Support backend responses that return either { coupons: [...] } or [...] directly
        if (Array.isArray(action.payload)) {
          state.coupons = action.payload;
        } else {
          state.coupons = action.payload?.coupons || [];
        }
        state.error = null;
      })
      .addCase(fetchAllCoupon.rejected, (state, action) => {
        state.loading = false;
        // action.payload may be set by rejectWithValue, otherwise use action.error
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Failed to fetch coupons";
        state.coupons = [];
      });

    // Get Coupon By ID
    builder
      .addCase(getCouponById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload.coupon;
      })
      .addCase(getCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch coupon";
      });

    // Delete Coupon
    builder
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload.id,
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete coupon";
        state.success = false;
      });

    // Update Coupon
    builder
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.coupons.findIndex(
          (coupon) => coupon._id === action.payload.coupon._id,
        );
        if (index !== -1) {
          state.coupons[index] = action.payload.coupon;
        }
        state.currentCoupon = action.payload.coupon;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update coupon";
        state.success = false;
      });

    // Toggle Coupon Status
    builder
      .addCase(toggleCouponStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(
          (coupon) => coupon._id === action.payload.coupon._id,
        );
        if (index !== -1) {
          state.coupons[index] = action.payload.coupon;
        }
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to toggle status";
      });
  },
});

export const { resetError, resetSuccess, clearCurrentCoupon } =
  couponSlice.actions;
export default couponSlice.reducer;
