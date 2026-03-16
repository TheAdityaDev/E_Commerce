import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";
import  secureLocalStorage  from  "react-secure-storage";
import { resetUserState } from "../Customer/userSlice";
import { resetSellerAuthState } from "../Seller/sellerAuthentication";

const API_URL = "/auth";

const initialState = {
  token: localStorage.getItem("token") || null,
  role: null,
  email: null,
  loading: false,
  error: null,
  otpSent: false,
};

// ==============================
// SEND OTP
// ==============================
export const sendLoginSignUpOtp = createAsyncThunk(
  "auth/sendLoginSignUpOtp",
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
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, otp, name, password, mobile, navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/signup`, {
        email,
        otp,
        name,
        password,
        mobile,
      });

      const { jwt, user } = response.data;

      secureLocalStorage.setItem("token", jwt);
      secureLocalStorage.setItem("role", user);

      navigate("/");

      return { token: jwt, role: user };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

// ==============================
// SIGN IN
// ==============================
export const signin = createAsyncThunk(
  "auth/signin", 
  async ({ email, password, otp , navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/signin`, {
        email,
        password,
        otp,
      });

      const { token, role } = response.data;

      secureLocalStorage.setItem("token", token);
      secureLocalStorage.setItem("role", role);
      navigate("/");

      return { token, role };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signin failed");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/forget-password",
  async ({ email, password, otp ,navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/forget-password`, {
        email,
        password,
        otp,
      });

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      navigate("/verify-otp");

      return { token, role };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signin failed");
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/forget-password",
  async ({ email, otp ,navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });

      
      navigate("/reset-password");

      return response.data;

      
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong...");
    }
  },
);
// ==============================
// SLICE
// ==============================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.email = null;
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== SEND OTP =====
      .addCase(sendLoginSignUpOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginSignUpOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.email = action.meta.arg;
      })
      .addCase(sendLoginSignUpOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== SIGNUP =====
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.otpSent = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== SIGNIN =====
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export const performedLogout = () => (dispatch) => {
  try {
    dispatch(logout());

    secureLocalStorage.removeItem("token");
    secureLocalStorage.removeItem("res");
    secureLocalStorage.removeItem("role");
    localStorage.removeItem("token")

    dispatch(resetSellerAuthState());
    dispatch(resetUserState());
  } catch (error) {
    console.log("Logout error:", error);
  }
};

export default authSlice.reducer;
