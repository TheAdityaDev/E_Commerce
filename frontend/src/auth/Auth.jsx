import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useNavigate, Link } from "react-router-dom";
import { logo, logoImage } from "../customer/json/common";
import cartAnimation from "../assets/animations/Grocery shopping bag pickup and delivery.json";
import Lottie from "lottie-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen  flex items-start justify-center bg-gray-100 px-4 py-4 lg:items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        {/* Image */}
        <div className="h-60 relative sm:h-52 overflow-hidden rounded-t-2xl lg:h-40">
          <span className="absolute flex items-center justify-between h-15 w-full p-2">
            <h1 className="logo">{logo.name}</h1>
            <img
            loading="lazy"
              src={logoImage.image}
              className="h-full w-25 rounded-full"
              alt={logoImage.alt}
            />
            
          </span>
          {/* <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=600&auto=format&fit=crop&q=60"
            alt="auth"
          /> */}
          <Lottie low={true} animationData={cartAnimation} className="h-full w-full bg-white rounded-full mix-blend-multiply" loop={true} />
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          
          {isLogin ?  <SignupForm /> : <LoginForm /> }
          <Link
            to="/forgetPassword"
            className="text-sm mt-5 underline-offset-2 text-teal-400 flex items-end justify-end hover:underline duration-150"
          >
            Forget Password ?
          </Link>

          <div className="flex items-center justify-center gap-1 mt-6 text-sm">
            <p className="text-gray-600">
              {isLogin ? "Already a member?": "Not a member?" }
            </p>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                navigate(isLogin ? "/auth/login" : "/auth/signup");
              }}
              className="text-teal-600 font-medium hover:underline"
            >
              {isLogin ? "Login" : "Signup" }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
