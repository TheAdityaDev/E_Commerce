import { Box, Button, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import OrderSteeper from "./OrderSteeper";
import { Payment } from "@mui/icons-material";
import { logo } from "../json/common";
import { ChevronLeft, Verified, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  cancelOrder,
  fetchOrderById,
  fetchOrderItemById,
} from "../../Redux Toolkit/Features/Customer/orderSlice";
import secureLocalStorage from "react-secure-storage";

const OrderDetail = () => {
  const [showImage, setShowImage] = useState(false);
  const { orderItemId, orderId } = useParams();
  const { currentOrder } = useAppSelector((store) => store?.orders);
  const orderItem = currentOrder?.orderItems?.[0];
  const dispatch = useAppDispatch();
  const token = secureLocalStorage.getItem("token")

  // Order fetch
  useEffect(() => {
    if (!orderId) return;

    dispatch(
      fetchOrderById({
        token: token,
        orderId,
      }),
    );
  }, [orderId, dispatch]);

  // OrderItem fetch
  useEffect(() => {
    if (!orderItemId) return;

    dispatch(
      fetchOrderItemById({
        token: token ,
        orderItemId,
      }),
    );
  }, [orderItemId, dispatch]);

  const cancelOrders = () => {
    dispatch(
      cancelOrder({
        token: token,
        orderId:orderId,
      }),
    );
  };
  

  
  return (
    <>
      {/* FULL SCREEN IMAGE MODAL */}
      {showImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setShowImage(false)}
            className="absolute top-5 right-5 text-white bg-gray-700/50 p-2 rounded-full hover:bg-gray-600 transition"
          >
            <X size={28} />
          </button>

          <img
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            src={orderItem?.product?.images[0]}
            alt={orderItem?.product?.title || "Product Image."}
          />
        </div>
      )}

      <Box className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* HEADER SECTION */}
        <section className="flex flex-col items-center gap-2 relative">
          {/* BACK BUTTON */}
          <Link
            to="/account/orders"
            className="absolute left-0 md:left-[-60px] top-2
            bg-gray-500/40 hover:bg-gray-700/50
            p-2 rounded-md transition lg:left-5"
          >
            <ChevronLeft className="text-white" size={28} />
          </Link>

          <p className="text-2xl font-bold">{orderItem?.product?.title}</p>

          <img
            onClick={() => setShowImage(true)}
            className="w-24 md:w-32 rounded-lg cursor-pointer hover:scale-105 transition"
            src={orderItem?.product?.images[0]}
            alt={orderItem?.product?.title || "Product Image"}
          />
          <p>{logo.name}</p>
          <p>{currentOrder?.product?.description}</p>
          <p>Size: {orderItem?.size}</p>
        </section>

        {/* STEPPER */}
        <section className="border border-gray-200 rounded-lg p-4 md:p-6">
          <OrderSteeper orderStatus={currentOrder?.orderStatus} />
        </section>

        {/* DELIVERY INFO */}
        <section className="border border-gray-200 rounded-lg p-4 md:p-6">
          <h1 className="font-bold pb-3 text-lg">Delivery Product</h1>

          <div className="text-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 font-medium">
              <p>Name: {currentOrder?.user?.name}</p>
              <Divider
                orientation="vertical"
                flexItem
                className="hidden sm:block"
              />
              <p>
                Number:{" "}
                {currentOrder?.user?.mobile ||
                  secureLocalStorage.getItem("res").mobile}
              </p>
              {currentOrder?.user?.address && (
                <p>
                  Alternate Number:{" "}
                  {currentOrder?.user?.alternateNumber ||
                    secureLocalStorage.getItem("res").alternateNumber}
                </p>
              )}
            </div>
            <span>
              <p className="flex items-center gap-2">
                Country :
                <span>
                  {currentOrder?.shippingAddress?.country ||
                    "No Address Till Now."}
                </span>
              </p>
              <p className="flex items-center gap-2">
                State :
                <span>
                  {currentOrder?.shippingAddress?.state ||
                    "No Address Till Now."}
                </span>
              </p>
              <p className="flex items-center gap-2">
                City :
                <span>
                  {currentOrder?.shippingAddress?.city ||
                    "No Address Till Now."}
                </span>
              </p>
              <p className="flex items-center gap-2">
                Pincode :
                <span>
                  {currentOrder?.shippingAddress?.pincode ||
                    "No Address Till Now."}
                </span>
              </p>
              <p className="flex items-center gap-2">
                Address :
                <span>
                  {currentOrder?.shippingAddress?.address ||
                    "No Address Till Now."}
                </span>
              </p>
              <p className="flex items-center gap-2">
                Locality :
                <span>
                  {currentOrder?.shippingAddress?.locality ||
                    "No Address Till Now."}
                </span>
              </p>
            </span>
          </div>
        </section>

        {/* PRICE SECTION */}
        <section className="border border-gray-200 rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-black text-base">Total Item Price</p>

              <p>
                You saved{" "}
                <span className="text-green-500 font-bold">
                  ₹{" "}
                  {orderItem?.product?.mrpPrice -
                    orderItem?.product?.sellingPrice}{" "}
                  on this item.
                </span>
              </p>

              <p className="text-lg font-semibold">
                ₹{" "}
                {currentOrder?.totalSellingPrice ||
                  "Something went wrong. Try again later."}
              </p>
            </div>

            <div>
              <div className="bg-teal-50 px-4 py-2 text-xs font-medium flex items-center gap-2 rounded-md">
                <Payment fontSize="small" />
                <p>Pay on delivery</p>
              </div>
            </div>
          </div>

          <Divider />

          <p className="text-sm flex items-start gap-1 mt-2">
            <strong className="ml-2 pr-1.5">Sold By: </strong>
            {currentOrder?.seller?.sellerName || "Seller Name Not Found."}
            <Verified size={10} className="text-blue-700" />
          </p>

          <Button
            fullWidth
            variant="outlined"
            onClick={cancelOrders}
            sx={{
              color: "red",
              borderColor: "red",
              "&:hover": {
                borderColor: "darkred",
                backgroundColor: "#ffe6e6",
              },
            }}
          >
            Cancel Order
          </Button>
        </section>
      </Box>
    </>
  );
};

export default OrderDetail;
