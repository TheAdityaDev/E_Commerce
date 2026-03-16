import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/products";

export const fetchHomePageData = createAsyncThunk(
  "home/fetchHomePageData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch home data",
      );
    }
  },
);

export const createHomeCategory = createAsyncThunk(
  "home/createHomeCategory",
  async (homeCategories, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/home/categories`, homeCategories);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create home category",   
      );
    }
  },
);

const HomeCategorySlice = createSlice({
    name: "home",
    initialState:{
        homeCategories: [],
        loading: false,
        error: null
    },
    reducers:{},

    extraReducers:(builder)=>{
        builder.addCase(fetchHomePageData.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchHomePageData.fulfilled,(state,action)=>{
            state.loading = false;
            state.homeCategories = action.payload;
        })
        .addCase(fetchHomePageData.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message || "Something Went Wrong...! Try Again Later";
        })

        .addCase(createHomeCategory.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(createHomeCategory.fulfilled,(state,action)=>{
            state.loading = false;
            state.homeCategories.push(action.payload);
        })
        .addCase(createHomeCategory.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default HomeCategorySlice.reducer