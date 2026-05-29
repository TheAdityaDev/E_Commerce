import React, { useMemo } from "react";
import SellerDrawerList from "../sidebar/SellerDrawerList";
import Navbar from "../../common/Navbar";
import SellerRoutes from "../../routes/SellerRoutes/SellerRoutes";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useEffect } from "react";
import { fetchSellerReport } from "../../Redux Toolkit/Features/Seller/sellerSlice";
import secureLocalStorage from "react-secure-storage";

const SellerDashboard = () => {
  const dispatch = useAppDispatch();

  const token = useMemo(() => secureLocalStorage.getItem("token"), []);

  const seller = useAppSelector((state) => state.seller || {});

  useEffect(() => {
    if (token && !seller?.isReportFetched && !seller?.report) {
      dispatch(fetchSellerReport());
    }
  }, [dispatch, token, seller?.isReportFetched, seller?.report]);

  return (
    <div className="min-h-screen">
      <Navbar DrawerList={SellerDrawerList} />
      <section className="lg:flex lg:h-[90vh]">
        <div className="hidden lg:block h-full">
          <SellerDrawerList />
        </div>
        <div className="p-10 w-full lg:w-[80%] overflow-y-auto">
          <SellerRoutes />
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
