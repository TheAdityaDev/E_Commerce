import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/transaction"

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
            console.log("seller profile", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch profile")
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
            state.transaction = action.payload
        })
        .addCase(fetchTransactionBySeller.rejected,(state , action)=>{
            state.loading = false
            state.error = action.error.message
        })
        .addCase(fetchTransactionBySeller.pending,(state)=>{
            state.error = null
            state.loading = true
        })
    }
})

export default transactionSlice.reducer