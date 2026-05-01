import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const initialState = {
  products: [],
  sellers: [],
  loading: false,
  error: null,
  profile: null,
  report: null,
  profileUpdate: false,
  isProfileFetched: false,
  isReportFetched: false,
};

const API_URL = "/seller";

const getValidToken = () => {
  const token = secureLocalStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
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

export const fetchSellerProfile = createAsyncThunk(
  "/seller/fetchSellerProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getValidToken();

      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("Token expired. Please login again.");
      }

      const response = await axiosInstance.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data.accountStatus && data.accountStatus !== "ACTIVE") {
        return rejectWithValue({
          message: data.message,
          accountStatus: data.accountStatus,
        });
      }

      // return profile data on success
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch profile"
      );
    }
  }
);

export const fetchSellers = createAsyncThunk(
  "/seller/fetchSellers",
  async ({ token, status, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status,
          page,
          limit: 10,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch sellers"
      );
    }
  }
);
export const fetchSellersById = createAsyncThunk(
  "/seller/fetchSellersById",
  async ({ token, sellerId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          sellerId,
        },
      });
      console.log("seller profile", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  },
);

export const updateSellerAccountStatus = createAsyncThunk(
  "/seller/updateSellerAccountStatus",
  async ({sellerId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/admin${API_URL}/${sellerId}/status/${status}`,{
          status
        },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        },
      );

      
      console.log("seller update account status ", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  },
);

export const fetchSellerReport = createAsyncThunk(
  "/seller/fetchSellerReport",
  async (_, { rejectWithValue }) => {
    try {
      const token = getValidToken(); 

      if (!token) {
        return rejectWithValue("Token missing");
      }

      const response = await axiosInstance.get(`${API_URL}/report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch report"
      );
    }
  }
);



const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isProfileFetched = false;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isProfileFetched = true;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
        // mark fetched so auth guard doesn't stay stuck on loading
        state.isProfileFetched = true;
      })

      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSellersById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellersById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateSellerAccountStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerAccountStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.profileUpdate = action.payload;
      })
      .addCase(updateSellerAccountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSellerReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isReportFetched = false;
      })
      .addCase(fetchSellerReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
        state.isReportFetched = true;
      })
      .addCase(fetchSellerReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
        state.isReportFetched = true; // mark fetched to avoid retry loop
      });
  },
});

export default sellerSlice.reducer;
