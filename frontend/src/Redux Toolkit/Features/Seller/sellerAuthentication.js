import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import { axiosInstance } from "../../../config/api.config";
import { toast } from "react-toastify";

const initialState = {
  token: null,
  role: null,
  email: null,
  otpSent: false,
};

const API_URL = "/seller";

// ==============================
// SEND OTP
// ==============================
export const verifyLoginOtp = createAsyncThunk(
  "auth/verifyLoginOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/verify/login-otp`, {
        email,
        otp,
      });

      const { token, role } = response.data;

      if (response.status === 200) {
        toast.success(response.data.message);
      }

      secureLocalStorage.setItem("token", token);
      secureLocalStorage.setItem("res", response.data);
      secureLocalStorage.setItem("role", role);

      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with status != 2xx
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        // Network error or no response
        toast.error("Network error, try again");
      }
      return rejectWithValue(error.response?.data || "Failed to send OTP");
    }
  },
);

// ==============================
// SIGN UP
// ==============================
export const createSeller = createAsyncThunk(
  "seller/createSeller",
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}`, sellerData);

      const { token, role } = response.data;

      if (response.status === 200) {
        toast.success(response.data.message);
      }

      secureLocalStorage.setItem("token", token);
      secureLocalStorage.setItem("res", response.data);
      secureLocalStorage.setItem("role", role);

      return { token, role };
    } catch (error) {
      if (error.response) {
        // Server responded with status != 2xx
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        // Network error or no response
        toast.error("Network error, try again");
      }
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  },
);

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    resetSellerAuthState: (state) => {
      state.token = null;
      state.role = null;
      state.email = null;
      state.otpSent = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== SEND OTP =====
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.email = action.meta.arg.email;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== SIGNUP =====
    builder.addCase(createSeller.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSeller.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.otpSent = false;
    });
    builder.addCase(createSeller.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetSellerAuthState } = sellerSlice.actions;

export default sellerSlice.reducer;
