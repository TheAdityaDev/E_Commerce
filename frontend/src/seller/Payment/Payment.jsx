import { Card, Divider } from '@mui/material'
import React from 'react'
import TransactionTable from '../sidebar/Transaction/TransactionTable'

const Payment = () => {
  return (
    <div className='space-y-5'>
      <div>
      <Card className='p-5 rounded-md space-y-4'>
        <h1>Total Earning</h1>
        <h1 className='font-bold text-xl pb-1'>₹30400</h1>
        <Divider />
        <p className='py-2'>Last Payment:00</p>
      </Card>
      </div>
      <TransactionTable />
    </div>
  )
}

export default Payment