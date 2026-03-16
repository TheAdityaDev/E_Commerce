import React from 'react'
import Navbar from '../../customer/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from '../../customer/pages/home/Home'
import Products from '../../customer/pages/Product/Products'
import ProductDetail from '../../customer/pages/Product/ProductDetail/ProductDetail'
import Cart from '../../customer/pages/Cart/Cart'
import Checkout from '../../customer/pages/checkout/Checkout'
import Profile from '../../customer/Order/Profile'
import Footer from '../../customer/footer/Footer'


const CustomerRoutes = () => {

  return (
    <>
     <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:categoryId" element={<Products />} />
        <Route path="/products/:categoryId/:name/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/address" element={<Checkout />} />
        <Route path="/account/*" element={<Profile />} />
      </Routes> 
       <Footer  />  
    </>
  )
}

export default CustomerRoutes