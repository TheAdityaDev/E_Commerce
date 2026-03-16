import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../../admin/Dashboard/AdminDashboard'
import Coupon from '../../admin/Coupon/Coupon'
import SellerTable from '../../admin/Seller/SellerTable'
import CouponForm from '../../admin/Coupon/CouponForm'
import GridTable from '../../admin/Home/GridTable'
import ElectronicTable from '../../admin/Home/ElectronicTable'
import Deal from '../../admin/Deal/Deal'
import ShopByCategory from '../../admin/Home/ShopByCategory'
import Products from '../../seller/Products/Products'

const AdminRoutes = () => {

  return (
    <Routes>
        <Route path='/' element={<SellerTable />} />
        <Route path='/coupon' element={<Coupon />} />
        <Route path='/add-coupon' element={<CouponForm />} />
        <Route path='/products' element={<Products />} />
        <Route path='/home-grid' element={<GridTable />} />
        <Route path='/electronic-category' element={<ElectronicTable />} />
        <Route path='/shop-by-category' element={<ShopByCategory />} />
        <Route path='/deal' element={<Deal />} />
    </Routes>
  )
}

export default AdminRoutes