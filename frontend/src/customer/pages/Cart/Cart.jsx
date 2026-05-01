import React, { useEffect } from "react";
import CartItemCard from "./CartItemCard";
import { Heart, Percent, Tags } from "lucide-react";
import TextField from "@mui/material/TextField";
import PricingCard from "./PricingCard";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { fetchCart } from "../../../Redux Toolkit/Features/Customer/cartSlice";
import secureLocalStorage from "react-secure-storage";
import Lottie from "lottie-react";
import no_product from "../../../assets/animations/no_product.json";
import { useNavigate } from "react-router-dom";
import {
  applyCoupon,
  clearCoupon,
} from "../../../Redux Toolkit/Features/Customer/couponSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((store) => store.cart);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      code: "",
      orderValue: cart?.cart?.totalMrpPrice,
      apply: true,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(
        applyCoupon({
          token: secureLocalStorage.getItem("token"),
          code: values.code,
          orderValue: values.orderValue,
          apply: true,
        }),
      );
    },
  });

  const couponState = useAppSelector((store) => store.coupon);

  useEffect(() => {
    dispatch(fetchCart(secureLocalStorage.getItem("token")));
    console.log(secureLocalStorage.getItem("token"))

  }, []);

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      {cart?.cart?.cartItems?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 space-y-5">
            {cart?.cart?.cartItems?.map((item) => (
              <CartItemCard key={item._id} item={item} />
            ))}
          </div>
          <div className="col-span-1 text-sm space-y-3 sticky top-[105px]">
            <div className="border rounded-md px-5 py-3 space-y-5">
              <div className="flex items-center ">
                <Tags className="mr-2 text-xl text-teal-500" />
                <span className="text-xl">Apply Coupon</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                {!couponState.couponApplied ? (
                  <>
                    <TextField
                      size="small"
                      type="text"
                      inputMode="text"
                      enterKeyHint="enter"
                      name="code"
                      label="Enter Coupon"
                      variant="outlined"
                      fullWidth
                      value={formik.values.code}
                      onChange={formik.handleChange}
                      error={formik.touched.code && Boolean(formik.errors.code)}
                      helperText={formik.touched.code && formik.errors.code}
                    />
                    <Button
                      disabled={
                        !formik.values.code ||
                        !cart?.cart?.totalMrpPrice ||
                        couponState.loading
                      }
                      onClick={formik.handleSubmit}
                      variant="outlined"
                      className="bg-blue-600 cursor-pointer text-white px-3 py-2 ml-2 rounded-md hover:bg-blue-700"
                    >
                      {couponState.loading ? (
                        <div className="flex items-center">
                          <CircularProgress size={18} color="inherit" />
                          <span className="ml-2">Applying</span>
                        </div>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="gap-4">
                      <div className="text-sm text-gray-500">
                        Applied Coupon
                      </div>
                      <div className="font-medium">
                        {couponState.appliedCode}
                      </div>
                      <div className="text-xs text-green-500">
                        Discount: ₹{couponState.coupon?.discount}
                      </div>
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          dispatch(clearCoupon());
                          formik.setFieldValue("code", "");
                        }}
                        variant="outlined"
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <section className="border rounded-md">
              <PricingCard discount={couponState.coupon?.discount} />
              <div className="p-5">
                {/* onClick={()=>navigate("/checkout/address")} */}
                <Button
                  onClick={() => navigate("/checkout/address")}
                  fullWidth
                  variant="outlined"
                >
                  Buy Now
                </Button>
              </div>
            </section>
            {/* <div className="border flex items-center justify-between cursor-pointer rounded-md p-5 active:scale-95">
              <span>Add To Wish List</span>
              <Heart className="ml-2 text-red-500 inline-block" />
            </div> */}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-start">
          <span className="w-150 h-150 relative">
            <Lottie
              animationData={no_product}
              fetchPriority="low"
              loading="lazy"
              loop={true}
              autoplay={true}
              className={`absolute h-150 w-150 transition-opacity duration-300`}
            />
          </span>
          <p className="text-lg text-gray-400">
            {secureLocalStorage.getItem("token")
              ? "Your cart is empty. Start shopping now!"
              : "Please login to view your cart."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
