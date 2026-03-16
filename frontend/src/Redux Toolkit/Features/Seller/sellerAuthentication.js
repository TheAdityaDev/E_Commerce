import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import { axiosInstance } from "../../../config/api.config";

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
export const sendLoginOTP = createAsyncThunk(
  "auth/sendLoginOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/send/login-signup-otp`,
        { email },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send OTP");
    }
  },
);

// ==============================
// SIGN UP
// ==============================
export const createSeller = createAsyncThunk(
  "seller/createSeller",
  async ({ rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}`,{
        mobile: "",
        otp: "",
        GSTIN: "",
        pickupAddress: {
          name: "",
          mobile: "",
          address: "",
          locality: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
        },
        bankDetails: {
          accountHolderName: "",
          accountNumber: "",
          ifscCode: "",
        },
        sellerName: "",
        email: "",
        businessDetails: {
          businessName: "",
          businessEmail: "",
          businessMobile: "",
          logo: "",
          banner: "",
          businessAddress: "",
        },
        password: "",
      });

      const { token, role } = response.data;

      console.log("Seller :", response.data);

      secureLocalStorage.setItem("token", token);
      secureLocalStorage.setItem("res",response.data)
      secureLocalStorage.setItem("role", role);
      return { token, role };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  },
);

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== SEND OTP =====
      .addCase(sendLoginOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.email = action.meta.arg;
      })
      .addCase(sendLoginOTP.rejected, (state, action) => {
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
    });},
});

export const { resetSellerAuthState } = sellerSlice.actions;

export default sellerSlice.reducer