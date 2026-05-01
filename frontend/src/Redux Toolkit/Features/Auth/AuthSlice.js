import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";
import { resetUserState } from "../Customer/userSlice";
import { resetSellerAuthState } from "../Seller/sellerAuthentication";
import { toast } from "react-toastify";

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
  async (email, { rejectWithValue, signal }) => {
    try {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      // 👇 also cancel if RTK aborts
      signal.addEventListener("abort", () => {
        controller.abort();
      });

      const response = await axiosInstance.post(
        `${API_URL}/send/login-signup-otp`,
        { email },
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId); 

      if (response.status === 200) {
        toast.success(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        console.log("Request canceled or timed out");
        return rejectWithValue("Request canceled");
      }

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error, try again");
      }

      return rejectWithValue(error.response?.data || "Failed to send OTP");
    }
  }
);
// ==============================
// SIGN UP
// ==============================
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { email, otp, name, password, mobile, navigate },
    { rejectWithValue, signal }
  ) => {
    try {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      signal.addEventListener("abort", () => {
        controller.abort();
      });

      const response = await axiosInstance.post(
        `${API_URL}/signup`,
        {
          email,
          otp,
          name,
          password,
          mobile,
        },
        {
          signal: controller.signal,
          timeout: 10000, // ✅ extra safety (axios-level timeout)
        }
      );

      clearTimeout(timeoutId); 

      const { jwt, user } = response.data;

      secureLocalStorage.setItem("token", jwt);
      secureLocalStorage.setItem("role", user);

      if (response.status === 200) {
        toast.success(response.data.message);
      }

      navigate("/");

      return { token: jwt, role: user };
    } catch (error) {
      // ❌ handle cancel / timeout cleanly
      if (error.code === "ERR_CANCELED") {
        console.log("Signup request canceled or timed out");
        return rejectWithValue("Request canceled");
      }

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error, try again");
      }

      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

// ==============================
// SIGN IN
// ==============================
export const signin = createAsyncThunk(
  "auth/signin",
  async ({ email, password, otp, navigate }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/signin`,
        {
          email,
          password,
          otp,
        },
        {
          signal,        
          timeout: 10000 
        }
      );

      const { token, role } = response.data;

      secureLocalStorage.setItem("token", token);

      try {
        const decoded = jwtDecode(token);

        if(!decoded){
          toast.success("Your session is expired..Please Login again")
          throw new Error("Invalid");
        }
      } catch (e) {
        console.warn("[AUTH] Failed to decode token for debug", e.message);
        return rejectWithValue("Invalid token")
      }

      secureLocalStorage.setItem("role", role);
      secureLocalStorage.setItem("res", response.data);

      if (response.status === 200) {
        if (
          response.data.role === "ADMIN" ||
          secureLocalStorage.getItem("role") === "admin"
        ) {
          navigate("/admin");
        } else if (response.data.role === "SELLER") {
          navigate("/seller");
        } else {
          navigate("/");
        }

        toast.success(response.data.message);
      }

      return { token, role };
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        console.log("Signin request canceled or timed out");
        return rejectWithValue("Request canceled");
      }

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error, try again");
      }

      return rejectWithValue(error.response?.data || "Signin failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ email, password, otp }, { rejectWithValue, signal }) => {
    try {
      // 🧹 clean email
      const cleanEmail = email.startsWith("signin_")
        ? email.slice(7)
        : email;

      const response = await axiosInstance.post(
        `${API_URL}/forget-password`,
        {
          email: cleanEmail,
          password,
          otp,
        },
        {
          signal,        // 👈 RTK abort support
          timeout: 10000 // 👈 10s timeout
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Password reset successfully");
      }

      return response.data;
    } catch (error) {
      // ❌ handle cancel / timeout
      if (error.code === "ERR_CANCELED") {
        console.log("Reset password request canceled or timed out");
        return rejectWithValue("Request canceled");
      }

      const errorMessage =
        error.response?.data?.message || "Something went wrong";

      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || errorMessage);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/forget-password",
  async ({ email, otp, navigate }, { rejectWithValue, signal }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/verify-otp`,
        {
          email,
          otp,
        },
        {
          signal,        // 👈 supports cancel
          timeout: 10000 // 👈 10s timeout
        }
      );

      navigate("/reset-password");

      return response.data;
    } catch (error) {
      // ❌ handle cancel / timeout cleanly
      if (error.code === "ERR_CANCELED") {
        console.log("Verify OTP request canceled or timed out");
        return rejectWithValue("Request canceled");
      }

      return rejectWithValue(
        error.response?.data || "Something went wrong..."
      );
    }
  }
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
    dispatch(resetUserState());
    dispatch(resetSellerAuthState());

    secureLocalStorage.removeItem("token");
    secureLocalStorage.removeItem("res");
    secureLocalStorage.removeItem("role");
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error("Logout failed. Please try again.", error);
  }
};

export default authSlice.reducer;
