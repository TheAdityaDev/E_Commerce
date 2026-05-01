import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux Toolkit/store";


const SellerAccountStatus = () => {
  const { profile } = useAppSelector((s) => s.seller || {});
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.accountStatus === "ACTIVE") {
      navigate("/seller");
    }
  }, [profile, navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Seller Account Status</h2>
      <p>
        {profile?.sellerName || "Your account"} is currently in state: <b>{profile?.accountStatus || "UNKNOWN"}</b>
      </p>
      <p>
        You cannot access seller pages until your account is ACTIVE. If you believe this is
        an error contact support or check back later.
      </p>
      <Link to="/">Return to home</Link>
    </div>
  );
};

export default SellerAccountStatus;
