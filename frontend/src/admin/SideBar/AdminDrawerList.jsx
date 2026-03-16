import React from "react";
import { ListItemIcon, ListItemText } from "@mui/material";
import {
  Category,
  Dashboard,
  ElectricBolt,
  Home,
  IntegrationInstructions,
  Inventory,
  LocalOffer,
  Logout,
  Receipt,
  ShoppingBag,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <Dashboard className="text-teal-700" />,
    activeIcon: <Dashboard className="text-white" />,
  },

  {
    name: "Coupons",
    path: "/admin/coupon",
    icon: <IntegrationInstructions className="text-teal-700" />,
    activeIcon: <IntegrationInstructions className="text-white" />,
  },
  {
    name: "Add Coupon",
    path: "/admin/add-coupon",
    icon: <Inventory className="text-teal-700" />,
    activeIcon: <Inventory className="text-white" />,
  },
  {
    name: "Home Page",
    path: "/admin/home-grid",
    icon: <Home className="text-teal-700" />,
    activeIcon: <Home className="text-white" />,
  },
  {
    name: "Electronics Category",
    path: "/admin/electronic-category",
    icon: <ElectricBolt className="text-teal-700" />,
    activeIcon: <ElectricBolt className="text-white" />,
  },
  {
    name: "Shop By Category",
    path: "/admin/shop-by-category",
    icon: <Category className="text-teal-700" />,
    activeIcon: <Category className="text-white" />,
  },
  {
    name: "Deals",
    path: "/admin/deal",
    icon: <LocalOffer className="text-teal-700" />,
    activeIcon: <LocalOffer className="text-white" />,
  },
];

const menu2 = [
  {
    name: "Logout",
    path: "/",
    icon: <Logout className="text-teal-700" />,
    activeIcon: <Logout className="text-white" />,
  },
];

const AdminDrawerList = ({ toggleDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handelLogout = () => {
    console.log("handel logout");
  };
  const handelClick = (item) => {
    if (item.name === "Logout") {
      // localStorage.clear();
      handelLogout();
    }

    navigate(item.path);
    // if(toggleDrawer)toggleDrawer(false)();
  };
  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-75 border-r border-gray-400 py-5">
        <div className="space-y-2">
          {menu.map((item) => (
            <div
              onClick={() => handelClick(item)}
              key={item.path}
              className="m-2"
            >
              <div
                className={`${
                  location.pathname === item.path
                    ? "bg-teal-600 text-white"
                    : ""
                } flex items-center px-5 py-3 rounded-2xl cursor-pointer`}
              >
                <ListItemIcon>
                  {location.pathname === item.path
                    ? item.activeIcon
                    : item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{ component: "span" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 mt-30 border-t border-gray-400">
          {menu2.map((item) => (
            <div
              onClick={() => handelClick(item)}
              key={item.path}
              className="m-2"
            >
              <div
                className={`${
                  location.pathname === item.path
                    ? "bg-teal-600 text-white"
                    : ""
                }
                ${item.name === "Logout" ? "bg-red-500/80 hover:bg-red-500 duration-200 transition-colors text-white" : ""}
              flex items-center px-5 py-3 rounded-2xl cursor-pointer mt-4`}
              >
                <ListItemIcon>
                  {location.pathname === item.path
                    ? item.activeIcon
                    : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDrawerList;
