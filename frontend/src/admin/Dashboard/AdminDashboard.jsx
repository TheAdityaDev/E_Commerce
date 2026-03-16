import React from "react";
import Navbar from "../../common/Navbar";
import AdminDrawerList from "../SideBar/AdminDrawerList";
import AdminRoutes from "../../routes/AdminRoutes/AdminRoutes";

const AdminDashboard = () => {
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
