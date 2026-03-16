import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../../config/api.config"


const initialState = {
    products:[],
    loading:false,
    error:null,
    profile:null,
    report:null,
    profileUpdate:false
}

const API_URL = "/seller"


export const fetchSellerProfile = createAsyncThunk(
    "/seller/fetchSellerProfile",
    async (token , { rejectWithValue })=>{
        try {
            const response = await axiosInstance.get(`${API_URL}/profile`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            )
            console.log("seller profile", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile")
        }
    }

)

export const fetchSellers = createAsyncThunk(
    "/seller/fetchSellers",
    async ({token , status , page  } , { rejectWithValue })=>{
        try {
            const response = await axiosInstance.get(`${API_URL}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                    ,params:{
                        status,
                        page,
                        limit:10
                    }
                }
            )
            console.log("seller profile", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile")
        }
    }

)

export const fetchSellersById = createAsyncThunk(
    "/seller/fetchSellersById",
    async ({token , sellerId   } , { rejectWithValue })=>{
        try {
            const response = await axiosInstance.get(`${API_URL}/${sellerId}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                    ,params:{
                       sellerId
                    }
                }
            )
            console.log("seller profile", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile")
        }
    }

)

export const updateSellerAccountStatus = createAsyncThunk(
    "/seller/updateSellerAccountStatus",
    async ({token , sellerId , status } , { rejectWithValue })=>{
        try {
            const response = await axiosInstance.put(`${API_URL}/${sellerId}/status/${status}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                    
                }
            )
            console.log("seller profile", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile")
        }
    }

)

const sellerSlice = createSlice({
    name:"seller",
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchSellerProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
        .addCase(fetchSellerProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
        })
        .addCase(fetchSellerProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

        .addCase(fetchSellers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
        .addCase(fetchSellers.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
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
    }
})

export default sellerSlice.reducer