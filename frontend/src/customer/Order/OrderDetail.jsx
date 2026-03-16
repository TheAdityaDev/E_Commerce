import { Box, Button, Divider } from "@mui/material";
import React, { useState } from "react";
import OrderSteeper from "./OrderSteeper";
import { Payment } from "@mui/icons-material";
import { logo } from "../json/common";
import { ChevronLeft, X } from "lucide-react";
import { Link } from "react-router-dom";

const OrderDetail = () => {
  const [showImage, setShowImage] = useState(false);

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
            src="https://media.istockphoto.com/id/1201024669/photo/handsome-man-in-casual-clothing.jpg?s=612x612&w=0&k=20&c=TexR7OTm-QRZCtkDecnSVgihtLMbG9WynadACrEiMf0="
            alt="Product"
          />
        </div>
      )}

      <Box className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">

        {/* HEADER SECTION */}
        <section className="flex flex-col items-center gap-4 relative">

          {/* BACK BUTTON */}
          <Link
            to="/account/orders"
            className="absolute left-0 md:left-[-60px] top-2
            bg-gray-500/40 hover:bg-gray-700/50
            p-2 rounded-md transition lg:left-5"
          >
            <ChevronLeft className="text-white" size={28} />
          </Link>

          <p className="text-2xl font-bold">{logo.name}</p>

          <img
            onClick={() => setShowImage(true)}
            className="w-24 md:w-32 rounded-lg cursor-pointer hover:scale-105 transition"
            src="https://media.istockphoto.com/id/1201024669/photo/handsome-man-in-casual-clothing.jpg?s=612x612&w=0&k=20&c=TexR7OTm-QRZCtkDecnSVgihtLMbG9WynadACrEiMf0=  "
            alt="Product"
          />
        </section>

        {/* STEPPER */}
        <section className="border border-gray-200 rounded-lg p-4 md:p-6">
          <OrderSteeper />
        </section>

        {/* DELIVERY INFO */}
        <section className="border border-gray-200 rounded-lg p-4 md:p-6">
          <h1 className="font-bold pb-3 text-lg">Delivery Product</h1>

          <div className="text-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 font-medium">
              <p>Aditya</p>
              <Divider orientation="vertical" flexItem className="hidden sm:block" />
              <p>9243234354</p>
            </div>

            <p>Street 123, Mumbai</p>
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
                  ₹7500.00 on this item.
                </span>
              </p>

              <p className="text-lg font-semibold">₹12454.50</p>
            </div>

            <div>
              <div className="bg-teal-50 px-4 py-2 text-xs font-medium flex items-center gap-2 rounded-md">
                <Payment fontSize="small" />
                <p>Pay on delivery</p>
              </div>
            </div>
          </div>

          <Divider />

          <p className="text-sm">
            <strong>Sold By:</strong> Ram Clothing
          </p>

          <Button
            fullWidth
            variant="outlined"
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
