import React, { Suspense, lazy } from "react";
import Navbar from "../../customer/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";

const FavoritesProduct = lazy(
  () => import("../../customer/pages/Product/FavoritesProduct"),
);

const Payment = lazy(() => import("../../customer/Order/Payment"));
const Rewards = lazy(() => import("../../customer/Navbar/Rewards"));

const Footer = lazy(() => import("../../customer/footer/Footer"));

const CustomerLoadingPage = lazy(
  () => import("../../Loading/CustomerLoadingPage"),
);
// Lazy-loaded components
const OgProductDetail = lazy(
  () => import("../../customer/pages/Product/ProductDetail/OgProductDetail"),
);
const CustomerNotFound = lazy(() => import("../../NotFound/CustomerNotFound"));
const Home = lazy(() => import("../../customer/pages/home/Home"));
const Products = lazy(() => import("../../customer/pages/Product/Products"));
const ProductDetail = lazy(
  () => import("../../customer/pages/Product/ProductDetail/ProductDetail"),
);
const Cart = lazy(() => import("../../customer/pages/Cart/Cart"));
const Checkout = lazy(() => import("../../customer/pages/checkout/Checkout"));
const Profile = lazy(() => import("../../customer/Order/Profile"));
const UpdateProfile = lazy(
  () => import("../../customer/pages/account/components/UpdateProfile"),
);

const CustomerRoutes = () => {
  return (
    <>
      <Navbar />

      <Suspense fallback={<CustomerLoadingPage />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:categoryId" element={<Products />} />
          <Route
            path="/products/:categoryId/:name/:productId"
            element={<ProductDetail />}
          />
          <Route path="/product/:productId" element={<OgProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/address" element={<Checkout />} />
          <Route path="/account/*" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/favorites" element={<FavoritesProduct />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/failed/:orderId" element={<Payment />} />
          <Route path="/payment/success/:orderId" element={<Payment />} />
          <Route path="*" element={<CustomerNotFound />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
};

export default CustomerRoutes;
