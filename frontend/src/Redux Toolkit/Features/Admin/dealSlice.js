import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/admin";

const initialState = {
  deals: [],
  loading: false,
  error: null,
};

export const createDeal = createAsyncThunk(
  "/deal/createSlice",
  async ({ token, deal }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/deals`, deal, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create deal");
    }
  },
);

export const fetchDeals = createAsyncThunk(
  "/deal/fetchDeals",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/deals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch deals");
    }
  },
);

export const getAllDeals = createAsyncThunk(
  "/deal/getAllDeals",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/deals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch deals");
    }
  },
);

export const deleteDeal = createAsyncThunk(
  "/deal/deleteDeal",
  async ({id , token}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/deals/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete deal");
    }
  },
)

export const updateDeal = createAsyncThunk(
  "/deal/updateDeal",
  async ({id , token, deal}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/deals/${id}`, deal,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update deal");
    }
  }, 
)

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals.push(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getAllDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(getAllDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(deleteDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = state.deals.filter((deal) => deal._id !== action.payload._id);
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(updateDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.findIndex((deal) => deal._id === action.payload._id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
    
export default dealSlice.reducer