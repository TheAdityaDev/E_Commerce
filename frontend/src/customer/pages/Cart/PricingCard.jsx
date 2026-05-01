import Divider from "@mui/material/Divider";
import React from "react";
import { useAppSelector } from "../../../Redux Toolkit/store";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../util/sumCartItemPrice";

const PricingCard = ({ discount }) => {
  const cart = useAppSelector((store) => store.cart);
  return (
    <div className="space-y-3 p-5">
      <div className="flex justify-between items-center">
        <span>Subtotal</span>
        <span>₹{sumCartItemSellingPrice(cart?.cart?.cartItems)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Discount</span>
        <span>
          ₹
          {sumCartItemMrpPrice(cart?.cart?.cartItems) -
            sumCartItemSellingPrice(cart?.cart?.cartItems)}
        </span>
      </div>
      {discount && (
        <div className="flex justify-between items-center">
          <span>Coupon Code Discount</span>
          <span>₹{discount}</span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <span>Shipping</span>
        <span>₹79</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Platform Fee</span>
        <span>Free</span>
      </div>
      <Divider />
      <div className="flex justify-between items-center font-medium font-bold">
        <span>Total</span>
        {discount ? (
          <span className="text-green-800">
            ₹
            {sumCartItemSellingPrice(cart?.cart?.cartItems) +
              79 -
              (discount || 0)}
          </span>
        ) : (
          <span>
            ₹
            {sumCartItemSellingPrice(cart?.cart?.cartItems) +
              79 -
              (discount || 0)}
          </span>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
