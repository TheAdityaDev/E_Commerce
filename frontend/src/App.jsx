import customTheme from "./theme/customTheme";
import { ThemeProvider } from "@emotion/react";
import React, { Suspense, lazy, useEffect } from "react";

// Lazy load components
const BecomeSeller = lazy(() => import("./auth/BecomeSeller"));
const SellerDashboard = lazy(
  () => import("./seller/SellerDashboard/sellerDashboard"),
);
const AdminDashboard = lazy(() => import("./admin/Dashboard/AdminDashboard"));
const Auth = lazy(() => import("./auth/Auth"));
const ForgetPassword = lazy(
  () => import("./auth/ForgetPassword/ForgetPassword"),
);
const CustomerRoutes = lazy(
  () => import("./routes/CustomerRoutes/CustomerRoutes"),
);

import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./Redux Toolkit/store";
import { fetchUserProfile } from "./Redux Toolkit/Features/Customer/userSlice";
import secureLocalStorage from "react-secure-storage";
import { fetchSellerProfile } from "./Redux Toolkit/Features/Seller/sellerSlice";
import { createHomeCategory } from "./Redux Toolkit/Features/Customer/HomeCategorySlice";
import { homeCategories } from "./data/homeCategories";
import CustomerLoadingPage from "./Loading/CustomerLoadingPage";
import { toast } from "react-toastify";

const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth || {});

  window.addEventListener("online", () => {
    toast.success("Back Online 🔥");
    window.location.reload(); // auto refresh
  });

  window.addEventListener("offline", () => {
    toast.error("You are Offline 😢");
    window.location.reload();
  });

  const token = secureLocalStorage.getItem("token")
  const role = secureLocalStorage.getItem("role")

useEffect(() => {
  if (!token) return;

  // 🔥 SELLER
  if (role === "seller") {
    if (!auth.seller) {
      dispatch(fetchSellerProfile());
    }
  }

  // 🔥 USER / ADMIN
  if (role === "customer" || role === "admin") {
    if (!auth.user) {
      dispatch(fetchUserProfile());
    }
  }
}, [token, role, dispatch]);
  useEffect(() => {
    // Only seed home categories in development to avoid repeated API calls
    if (import.meta.env.NODE_ENV === "development") {
      dispatch(createHomeCategory(homeCategories));
    }
  }, [dispatch]);
  return (
    <ThemeProvider theme={customTheme}>
      <Suspense fallback={<CustomerLoadingPage />}>
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
