import { Divider } from "@mui/material";
import { lazy, Suspense } from "react";
const OrderDetail = lazy(() => import("./OrderDetail"));
const UserDetail = lazy(() => import("../pages/account/UserDetail"));
const Order = lazy(() => import("./Order"));
const Address = lazy(() => import("./Address"));
const Transactions = lazy(() => import("./TransactionHistory"));
const AllPosts = lazy(() => import("./AllPosts"));

import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { performedLogout } from "../../Redux Toolkit/Features/Auth/AuthSlice";
import { toast } from "react-toastify";
import {
  User,
  ShoppingCart,
  CreditCard,
  MapPinPlus,
  LogOut,
  MessageCircleMoreIcon,
} from "lucide-react";
import { PostAddOutlined } from "@mui/icons-material";

const menu = [
  { icons: <User className="size-4.5" />, name: "profile", path: "/account" },
  {
    icons: <ShoppingCart className="size-4.5" />,
    name: "orders",
    path: "/account/orders",
  },
  {
    icons: <CreditCard className="size-4.5" />,
    name: "Transactions",
    path: "/account/transactions",
  },
  {
    icons: <MapPinPlus className="size-4.5" />,
    name: "newAddress",
    path: "/account/new-address",
  },
  {
    icons: <MessageCircleMoreIcon className="size-4.5" />,
    name: "Posts",
    path: "/account/all/posts",
  },
  { icons: <LogOut className="size-4.5" />, name: "logout", path: "/" },
];

const Profile = () => {
  const { user } = useAppSelector((state) => state.user.user || {});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handelLogout = async () => {
    await dispatch(performedLogout());

    toast.success("Logout Successfully");
    navigate("/auth/login");
  };

  const handelClick = (item) => {
    if (item.name === "logout") {
      handelLogout();
    }
    navigate(item.path);
  };

  return (
    <div className="px-5 lg:px-52 min-h-screen mt-10">
      <div>
        <h1 className="text-xl font-bold pb-5 flex items-center gap-2">
          👋 Hello,
          <p className="bg-gradient-to-r text-2xl from-teal-400 to-blue-700 bg-clip-text text-transparent">
            {user?.name}
          </p>
        </h1>
        <Divider />
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]">
          <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-6">
            {/* SIDEBAR */}
            <div
              className="
          flex lg:flex-col
          gap-3 
          overflow-x-auto lg:overflow-visible mt-10
          pb-3 lg:pb-0
           lg:sticky lg:top-40   /* 👈 Sticky magic */
        lg:h-fit             /* 👈 prevents stretch */
          "
            >
              {menu.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.name}
                    onClick={() => handelClick(item)}
                    className={`
                  whitespace-nowrap
                  cursor-pointer
                  flex items-center gap-1
                  px-4 py-2 text-sm font-medium
                  rounded-md border
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white border-transparent"
                      : "hover:bg-gray-100"
                  }

                  ${
                    item.name === "logout"
                      ? " bg-red-200 hover:bg-red-400 hover:text-white duration-300 transition-colors"
                      : ""
                  }
                `}
                  >
                    {item.icons}
                    {item.name.toLocaleUpperCase()}
                  </button>
                );
              })}
            </div>
            <Divider
              orientation="vertical"
              flexItem
              className="hidden lg:block"
            />
          </div>
          <div className="lg:col-span-2 lg:pl-5 py-5">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route index element={<UserDetail />} />
                <Route path="orders" element={<Order />} />
                <Route
                  path="/orders/:orderId/item/:orderItemId"
                  element={<OrderDetail />}
                />
                <Route path="/new-address" element={<Address />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="/all/posts" element={<AllPosts />} />

                {/* Optional: 404 */}
                <Route path="*" element={<h1>Page Not Found</h1>} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
