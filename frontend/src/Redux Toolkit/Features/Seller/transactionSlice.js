import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/transactions"

const initialState = {
    transaction:[],
    loading:false,
    error:null
}

export const fetchTransactionBySeller = createAsyncThunk(
    "/transaction/fetchTransactionBySeller",
    async (token , { rejectWithValue })=>{
        try {
            const response = await axiosInstance.get(`${API_URL}/seller`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            )
            console.log("seller transaction", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile")
        }
    }
)

export const fetchTransactionByUser = createAsyncThunk(
    "/transaction/fetchTransactionByUser",
    async (arg, { rejectWithValue }) => {
        try {
            const token = typeof arg === "string" ? arg : arg?.token;
            if (!token) {
                return rejectWithValue("Missing auth token");
            }
            const response = await axiosInstance.get(`${API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            return Array.isArray(data) ? data : data?.transactions ?? [];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch transactions");
        }
    }
)

const transactionSlice = createSlice({
    name:"transaction",
    initialState,  
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchTransactionBySeller.fulfilled,(state , action)=>{
            state.loading = false
            const payload = action.payload
            state.transaction = Array.isArray(payload) ? payload : []
        })
        .addCase(fetchTransactionBySeller.rejected,(state , action)=>{
            state.loading = false
            state.error = action.error.message
        })
        .addCase(fetchTransactionBySeller.pending,(state)=>{
            state.error = null
            state.loading = true
        })
        .addCase(fetchTransactionByUser.fulfilled,(state , action)=>{
            state.loading = false
            const payload = action.payload
            state.transaction = Array.isArray(payload) ? payload : []
        })
        .addCase(fetchTransactionByUser.rejected,(state , action)=>{
            state.loading = false
            state.error = action.error.message
        })
        .addCase(fetchTransactionByUser.pending,(state)=>{
            state.error = null
            state.loading = true
        })
    }
})

export default transactionSlice.reducer