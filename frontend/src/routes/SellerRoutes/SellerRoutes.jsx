import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from '../../seller/Home/HomePage'
import Products from '../../seller/Products/Products'
import AddProducts from '../../seller/Products/AddProducts'
import Orders from '../../seller/Orders/Orders'
import Account from '../../seller/Account/Account'
import Payment from '../../seller/Payment/Payment'
import Transaction from '../../seller/sidebar/Transaction/Transaction'

const SellerRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/products' element={<Products />} />
        <Route path='/add/product' element={<AddProducts />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/account' element={<Account />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/transactions' element={<Transaction />} />
    </Routes>
  )
}

export default SellerRoutes