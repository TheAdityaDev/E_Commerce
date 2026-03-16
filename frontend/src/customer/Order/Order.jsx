import OrderItemCard from "./OrderItemCard"

const Order = () => {
  return (
    <div  className='text-sm min-h-screen'>
      <div className="pb-5">
        <h1 className='font-semibold  text-2xl'>All Orders</h1>
        <p>From anytime</p>
      </div> 
      <div>
        {[1,1,1].map((item,i)=>(
          <OrderItemCard  key={i} />
        ))}
      </div>
    </div>
  )
}

export default Order