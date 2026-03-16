import React from 'react'
import SellerDrawerList from '../sidebar/sellerDrawerList'
import Navbar from '../../common/Navbar'
import SellerRoutes from '../../routes/SellerRoutes/SellerRoutes'

const sellerDashboard = () => {
  return (
      <div className='min-h-screen'>
        <Navbar DrawerList={SellerDrawerList}/>
        <section className='lg:flex lg:h-[90vh]'> 
          <div className="hidden lg:block h-full">
          <SellerDrawerList />
          </div>
        <div className="p-10 w-full lg:w-[80%] overflow-y-auto">
          <SellerRoutes/>
        </div>
        </section>
    </div>
  )
}

export default sellerDashboard