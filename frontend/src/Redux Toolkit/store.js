import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./Features/Auth/AuthSlice";
import userReducer from "./Features/Customer/userSlice";
import productReducer from "./Features/Customer/productSlice";
import orderReducer from "./Features/Customer/orderSlice";
import cartReducer from "./Features/Customer/cartSlice"
import couponReducer from "./Features/Customer/couponSlice"
import homeReducer from "./Features/Customer/HomeCategorySlice"
import sellerAuthReducer from "./Features/Seller/sellerAuthentication";
import sellerOrderReducer from "./Features/Seller/sellerOrderSlice";
import sellerProductReducer from "./Features/Seller/sellerProductSlice";
import sellerReducer from "./Features/Seller/sellerSlice";
import transactionReducer from "./Features/Seller/transactionSlice";
import adminReducer from "./Features/Admin/adminSlice";
import dealReducer from "./Features/Admin/dealSlice";
import adminCouponReducer from "./Features/Admin/couponSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  user:userReducer,
  products:productReducer,
  orders:orderReducer,
  cart:cartReducer,
  coupon:couponReducer,
  home:homeReducer,

  // Seller Reducers
  sellerAuth: sellerAuthReducer,
  sellerOrders: sellerOrderReducer,
  sellerProduct:sellerProductReducer,
  seller:sellerReducer,

  // transaction reducers
  transaction:transactionReducer,

  // admin reducers
  admin:adminReducer,
  deal:dealReducer,
  adminCoupon:adminCouponReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;