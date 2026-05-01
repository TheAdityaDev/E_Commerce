import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchSellerProfile } from "../../Redux Toolkit/Features/Seller/sellerSlice";
import { toast } from "react-toastify";

const SellerAuthGuard = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, loading, error, isProfileFetched } =
    useAppSelector((s) => s.seller);

  // 🔥 Fetch only once
  useEffect(() => {
    if (!isProfileFetched) {
      dispatch(fetchSellerProfile());
    }
  }, [dispatch, isProfileFetched]);

  // 🔥 Handle errors (blocked/suspended etc.)
  useEffect(() => {
    if (error?.accountStatus) {
      const path = `/seller/${error.accountStatus.toLowerCase()}`;

      if (location.pathname !== path) {
        toast.error(error.message || "Account issue");
        navigate(path);
      }
    }
  }, [error, navigate, location.pathname]);

  // 🔥 Handle inactive accounts
  useEffect(() => {
    if (
      profile?.accountStatus &&
      profile.accountStatus !== "ACTIVE"
    ) {
      const path = `/seller/${profile.accountStatus.toLowerCase()}`;

      if (location.pathname !== path) {
        navigate(path);
      }
    }
  }, [profile, navigate, location.pathname]);

  // 🔥 Loading state
  if (loading || !isProfileFetched) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default SellerAuthGuard;