import Divider from '@mui/material/Divider'
import React from 'react'

const PricingCard = () => {
  return (
    <div className='space-y-3 p-5'>
      <div className="flex justify-between items-center">
        <span>Subtotal</span>
        <span>$1000</span>
      </div>
        <div className="flex justify-between items-center">
        <span>Discount</span>
        <span>$100</span>
      </div>
        <div className="flex justify-between items-center">
        <span>Shipping</span>
        <span>$10</span>
      </div>
        <div className="flex justify-between items-center">
        <span>Platform Fee</span>
        <span>Free</span>
      </div>
      <Divider />
        <div className="flex justify-between items-center font-medium font-bold">
        <span>Total</span>
        <span>$1110</span>
      </div>
    </div>
  )
}

export default PricingCard