import React from 'react'
import TransactionTable from './TransactionTable'

const Transaction = () => {
  return (
    <div>
       <h1 className='mb-5 text-2xl font-semibold italic'>All Transaction</h1>
      <TransactionTable />
    </div>
  )
}

export default Transaction