import { useEffect } from "react";
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
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  performedLogout,
} from "../../Redux Toolkit/Features/Auth/AuthSlice";
import { fetchUserProfile } from "../../Redux Toolkit/Features/Customer/userSlice";
import secureLocalStorage from "react-secure-storage";

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
    path: "/admin/deals",
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
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store?.user?.user);

  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token]);

  const location = useLocation();
  const navigate = useNavigate();

  const handelLogout = async () => {
    await dispatch(performedLogout());
    navigate("/");
  };
  const handelClick = (item) => {
    if (item.name === "Logout") {
      handelLogout();
    }

    navigate(item.path);
    // if(toggleDrawer)toggleDrawer(false)();
  };
  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-75 border-r border-gray-400 py-5">
        <h1 className="m-3 text-2xl">👋 {user?.name || "Admin"}</h1>
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
