import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";

const API_URL = "/user";

const getValidToken = () => {
  const token = secureLocalStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.info(
        "[TOKEN DEBUG] Token expired according to decoded.exp, clearing storage",
      );
      secureLocalStorage.removeItem("res");
      secureLocalStorage.removeItem("role");
      secureLocalStorage.removeItem("token");
      return null;
    }

    return token;
  } catch (error) {
    error.response?.data || "Invalid Credentials";
    secureLocalStorage.removeItem("token");
    return null;
  }
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue, signal }) => {
    try {
      const token = getValidToken();

      if (!token) {
        return rejectWithValue("Token expired. Please login again.");
      }

      const response = await axiosInstance.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return rejectWithValue("Request canceled");
      }

      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, value, field }, { rejectWithValue, signal }) => {
    try {
      const token = getValidToken();

      if (!token) {
        return rejectWithValue("Token expired. Please login again.");
      }

      const response = await axiosInstance.patch(
        `${API_URL}/update/profile/${userId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
          timeout: 10000,
        },
      );

      return response.data;
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return rejectWithValue("Request canceled");
      }

      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  },
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
