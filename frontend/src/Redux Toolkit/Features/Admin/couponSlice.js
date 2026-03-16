import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../../config/api.config";


const API_URL = "/coupon"

const initialState = {
    coupons: [],
    loading: false,
    error: null,
}


export const createCoupon = createAsyncThunk(
    "/coupon/createCoupon",
    async ({ token, coupon }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/create`, coupon, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("create coupon", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create coupon");
        }
    },
)

export const fetchAllCoupon = createAsyncThunk(
    "/coupon/fetchAllCoupon",
    async (token, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("fetch all coupon", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch all coupon");
        }
    },
)

export const deleteCoupon = createAsyncThunk(
    "/coupon/deleteCoupon",
    async ({id , token}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete coupon");
        }
    },
)

export const updateCoupon = createAsyncThunk(
    "/coupon/updateCoupon",
    async ({id , token, coupon}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${API_URL}/${id}`, coupon, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Failed to update coupon");
    }
})

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons.push(action.payload);
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        builder
                .addCase(fetchAllCoupon.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchAllCoupon.fulfilled, (state, action) => {
                    state.loading = false;
                    state.coupons = action.payload;
                })
                .addCase(fetchAllCoupon.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                });

                builder
                .addCase(deleteCoupon.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(deleteCoupon.fulfilled, (state, action) => {
                    state.loading = false;
                    state.coupons = state.coupons.filter((coupon) => coupon._id !== action.payload._id);
                })
                .addCase(deleteCoupon.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                });

                builder
                .addCase(updateCoupon.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(updateCoupon.fulfilled, (state, action) => {
                    state.loading = false;
                    state.coupons = state.coupons.map((coupon) => coupon._id === action.payload._id ? action.payload : coupon);
                })
                .addCase(updateCoupon.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                });
    },
});

export default couponSlice.reducer;
                
