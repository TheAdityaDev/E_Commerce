import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/home";

export const updateHomeCategory = createAsyncThunk(
  "/home/updateHomeCategory",
  async ({ token, data, id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/home-categories`,
        data,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: id,
          },
        },
      );
      console.log("update home category", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update home category",
      );
    }
  },
);

export const fetchHomeCategory = createAsyncThunk(
  "/home/fetchHomeCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/home-categories`);
      console.log("fetch home category", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch home category",
      );
    }
  },
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const homeCategorySlice = createSlice({
  name: "homeCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default homeCategorySlice.reducer