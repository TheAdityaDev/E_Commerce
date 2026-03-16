import React, { Suspense, lazy, useState } from "react";

import { Button } from "@mui/material";

const SellerLogin = lazy(() => import("./BecomeSeller/SellerLogin"));
const SellerAccountForm = lazy(
  () => import("./BecomeSeller/SellerAccountForm"),
);

const BecomeSeller = () => {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="grid md:gap-5 grid-cols-3 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
      <section className="lg:col-span-1 md:col-span-2 col-span-3 shadow-lg rounded-b-2xl">
        {isLogin ? <SellerLogin /> : <SellerAccountForm />}
        <div className="mt-10 space-y-3 p-5">
          <h1 className="font-medium text-center text-sm">Have an account?</h1>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            variant="contained"
            fullWidth
            sx={{ py: "12px" }}
          >
            {isLogin ? "Create an account" : "Login"}
          </Button>
        </div>
      </section>
      <section className="col-span-2 mt-15 bg-white">
        <div className="hidden md:flex md:col-span-1 lg:col-span-2 ">
          <img
            loading="lazy"
            className=" object-cover"
            fetchPriority="high"
            src="https://m.media-amazon.com/images/G/31/amazonservices/Becoming_an_online_seller.jpg"
            alt=""
          />
        </div>
      </section>
      </Suspense>
    </div>
  );
};

export default BecomeSeller;
