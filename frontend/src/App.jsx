import customTheme from "./theme/customTheme";
import { ThemeProvider } from "@emotion/react";
import React, { Suspense, lazy, useEffect } from "react";

// Lazy load components
const BecomeSeller = lazy(() => import("./auth/BecomeSeller"));
const SellerDashboard = lazy(() => import("./seller/SellerDashboard/sellerDashboard"));
const AdminDashboard = lazy(() => import("./admin/Dashboard/AdminDashboard"));
const Auth = lazy(() => import("./auth/Auth"));
const ForgetPassword = lazy(() => import("./auth/ForgetPassword/ForgetPassword"));
const CustomerRoutes = lazy(() => import("./routes/CustomerRoutes/CustomerRoutes"));

import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./Redux Toolkit/store";
import { fetchUserProfile } from "./Redux Toolkit/Features/Customer/userSlice";
import secureLocalStorage from "react-secure-storage";


const App = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state);

  useEffect(() => {
    if (auth.jwt || secureLocalStorage.getItem("token")) {
      // Dispatch the fetchUserProfile action to load user data
      dispatch(fetchUserProfile());
    }
    
  }, [auth.jwt || secureLocalStorage.getItem("token")]);
  return (
    <ThemeProvider theme={customTheme}>
    {/* Suspense shows fallback while the component loads */}
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/seller/*" element={<SellerDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </Suspense>
  </ThemeProvider>
  );
};

export default App;
