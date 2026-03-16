import { ListItemIcon, ListItemText } from "@mui/material";
import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  Dashboard,
  Home,
  Inventory,
  Logout,
  Receipt,
  ShoppingBag,
} from "@mui/icons-material";
import React from "react";
import { useLocation, useNavigate } from "react-router";

const menu = [
  {
    name: "Dashboard",
    path: "/seller",
    icon: <Dashboard className="text-teal-700" />,
    activeIcon: <Dashboard className="text-white" />,
  },
  {
    name: "Order",
    path: "/seller/orders",
    icon: <ShoppingBag className="text-teal-700" />,
    activeIcon: <ShoppingBag className="text-white" />,
  },
  {
    name: "Products",
    path: "/seller/products",
    icon: <Inventory className="text-teal-700" />,
    activeIcon: <Inventory className="text-white" />,
  },
  {
    name: "Add Product",
    path: "/seller/add/product",
    icon: <Add className="text-teal-700" />,
    activeIcon: <Add className="text-white" />,
  },
  {
    name: "Payment",
    path: "/seller/payment",
    icon: <AccountBalanceWallet className="text-teal-700" />,
    activeIcon: <AccountBalanceWallet className="text-white" />,
  },
  {
    name: "Transactions",
    path: "/seller/transactions",
    icon: <Receipt className="text-teal-700" />,
    activeIcon: <Receipt className="text-white" />,
  },
];

const menu2 = [
  {
    name: "Account",
    path: "/seller/account",
    icon: <AccountBox className="text-teal-700" />,
    activeIcon: <AccountBox className="text-white" />,
  },
  {
    name: "Logout",
    path: "/",
    icon: <Logout className="text-teal-700" />,
    activeIcon: <Logout className="text-white" />,
  },
];

const SellerDrawerList = ({ toggleDrawer }) => {
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
              flex items-center px-5 py-3 rounded-2xl cursor-pointer`}
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

export default SellerDrawerList;
