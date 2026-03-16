import React from "react";
import CartItemCard from "./CartItemCard";
import { Heart, Percent, Tags } from "lucide-react";
import TextField from "@mui/material/TextField";
import PricingCard from "./PricingCard";
import Button from "@mui/material/Button";

const Cart = () => {
  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {[1, 1, 1, 1].map((item, index) => (
            <CartItemCard key={index} />
          ))}
        </div>
        <div className="col-span-1 text-sm space-y-3">
          <div className="border rounded-md px-5 py-3 space-y-5">
            <div className="flex items-center ">
              <Tags className="mr-2 text-xl text-teal-500" />
              <span className="text-xl">Apply Coupon</span>
            </div>
            <div className="flex justify-between items-center">
              <TextField
                size="small"
                label="Enter Coupon"
                variant="outlined"
                fullWidth
              />
              <button className="bg-blue-600 text-white px-3 py-2 ml-2 rounded-md hover:bg-blue-700">
                Apply
              </button>
            </div>
          </div>
          <section className="border rounded-md">
            <PricingCard />
            <div className="p-5">
              <Button fullWidth variant="outlined">
                Buy Now
              </Button>
            </div>
          </section>
          <div className="border flex items-center justify-between cursor-pointer rounded-md p-5 active:scale-95">
            <span>Add To Wish List</span>
            <Heart className="ml-2 text-red-500 inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
