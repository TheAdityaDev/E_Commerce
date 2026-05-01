import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy imports
const SellerTable = lazy(() => import("../../admin/Seller/SellerTable"));
const Coupon = lazy(() => import("../../admin/Coupon/Coupon"));
const CouponForm = lazy(() => import("../../admin/Coupon/CouponForm"));
const Products = lazy(() => import("../../seller/Products/Products"));
const GridTable = lazy(() => import("../../admin/Home/GridTable"));
const ElectronicTable = lazy(() => import("../../admin/Home/ElectronicTable"));
const ShopByCategory = lazy(() => import("../../admin/Home/ShopByCategory"));
const Deal = lazy(() => import("../../admin/Deal/Deal"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<SellerTable />} />
        <Route path="/coupon" element={<Coupon />} />
        <Route path="/add-coupon" element={<CouponForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="/home-grid" element={<GridTable />} />
        <Route path="/electronic-category" element={<ElectronicTable />} />
        <Route path="/shop-by-category" element={<ShopByCategory />} />
        <Route path="/deals" element={<Deal />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;