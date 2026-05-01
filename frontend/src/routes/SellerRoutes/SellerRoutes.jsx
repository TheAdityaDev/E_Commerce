import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const SellerAccountStatus = lazy(() => import('./SellerAccountStatus'))
const SellerAuthGuard = lazy(() => import('./SellerAuthGuard'))

// Lazy imports
const HomePage = lazy(() => import('../../seller/Home/HomePage'))
const Products = lazy(() => import('../../seller/Products/Products'))
const AddProducts = lazy(() => import('../../seller/Products/AddProducts'))
const Orders = lazy(() => import('../../seller/Orders/Orders'))
const Account = lazy(() => import('../../seller/Account/Account'))
const Payment = lazy(() => import('../../seller/Payment/Payment'))
const Transaction = lazy(() => import('../../seller/sidebar/Transaction/Transaction'))

const SellerRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
      <Route path="/seller/:accountStatus" element={<SellerAccountStatus />} />

        <Route
          path="/*"
          element={
            <SellerAuthGuard>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/products' element={<Products />} />
                <Route path='/add/product' element={<AddProducts />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/account' element={<Account />} />
                <Route path='/payment' element={<Payment />} />
                <Route path='/transactions' element={<Transaction />} />
              </Routes>
            </SellerAuthGuard>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default SellerRoutes