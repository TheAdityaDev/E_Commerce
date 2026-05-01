import OrderItemCard from "./OrderItemCard";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { fetchUserOrderHistory } from "../../Redux Toolkit/Features/Customer/orderSlice";

const Order = () => {
  const dispatch = useAppDispatch();
  const order = useAppSelector((store) => store?.orders?.orders);

  // console.log("Response:",secureLocalStorage.getItem("res"));

  useEffect(() => {
    dispatch(fetchUserOrderHistory(secureLocalStorage.getItem("token")));
  }, []);


  
  return (
    <div className="text-sm min-h-screen">
      <div className="pb-5">
        <h1 className="font-semibold  text-2xl">All Orders</h1>
        <p>From anytime</p>
      </div>
      <div>
        {order?.orders?.map((order) => (
          <div key={order.id}>
            {order?.orderItems?.map((orderItem) => (
              <OrderItemCard
                key={orderItem.id}
                order={order}
                orderItem={orderItem}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
