import React, { useEffect } from "react";
import Navbar from "../../common/Navbar";
import AdminDrawerList from "../SideBar/AdminDrawerList";
import AdminRoutes from "../../routes/AdminRoutes/AdminRoutes";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { fetchHomePageData } from "../../Redux Toolkit/Features/Customer/HomeCategorySlice";
import { getAllProducts } from "../../Redux Toolkit/Features/Customer/productSlice";
import { getAllDeals } from "../../Redux Toolkit/Features/Admin/dealSlice";
import secureLocalStorage from "react-secure-storage";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch all necessary data for admin dashboard
    dispatch(fetchHomePageData());
    
    // Fetch all products
    dispatch(getAllProducts({
      pageNumber: 0,
      limit: 10
    }));

    // Fetch all deals
    const token = secureLocalStorage.getItem("token");
    if (token) {
      dispatch(getAllDeals(token));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Navbar DrawerList={AdminDrawerList} />
      <section className="lg:flex lg:h-[90dvh]">
        <div className="hidden lg:block h-full">
          <AdminDrawerList />
        </div>
        <div className="p-10 w-full lg:w-[80%] overflow-y-auto ">
          <AdminRoutes />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
