import {
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  AddShoppingCart,
  Logout,
  Menu,
  People,
  Storefront,
} from "@mui/icons-material";
import { mainCategory } from "../../data/category/mainCategory";
import { useRef, useState } from "react";
import CategorySheet from "./CategorySheet";
import { Heart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../json/common";
import Lottie from "lottie-react";
import animation1 from "../../assets/animations/Shopping.json";
import animation2 from "../../assets/animations/ecommerce.json";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { performedLogout } from "../../Redux Toolkit/Features/Auth/AuthSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [openDrawer, setOpenDrawer] = useState(false);
  const anim1Ref = useRef();
  const anim2Ref = useRef();
  const [active, setActive] = useState(1);

  const handleComplete = () => {
    if (active === 1) {
      setActive(2);
      anim2Ref.current?.goToAndPlay(0, true);
    } else {
      setActive(1);
      anim1Ref.current?.goToAndPlay(0, true);
    }
  };

  const theme = useTheme();
  const navigate = useNavigate();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  // logout
  const handelLogout = async () => {
    await dispatch(performedLogout());
  
    toast.success("Logout Successfully");
    navigate("/auth/login");
  };

  return (
    <Box className="sticky top-0 bg-white z-50 shadow-sm ">
      {/* NAVBAR */}
      <div className="flex items-center justify-between h-16 px-2 sm:px-10  lg:px-20">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          {!isLarge && (
            <IconButton onClick={() => setOpenDrawer(true)}>
              <Menu />
            </IconButton>
          )}
          <span className="relative h-10 w-10">
            {" "}
            {/* Animation 1 */}{" "}
            <Lottie
              lottieRef={anim1Ref}
              loading="lazy"
              animationData={animation1}
              loop={false}
              autoplay={active === 1}
              onComplete={handleComplete}
              className={`absolute h-10 w-10 transition-opacity duration-300 ${active === 1 ? "opacity-100" : "opacity-0"}`}
            />{" "}
            {/* Animation 2 */}{" "}
            <Lottie
              lottieRef={anim2Ref}
              animationData={animation2}
              loading="lazy"
              loop={false}
              autoplay={false}
              onComplete={handleComplete}
              className={`absolute h-10 w-10 transition-opacity duration-300 ${active === 2 ? "opacity-100" : "opacity-0"}`}
            />{" "}
          </span>
          {/* Logo */}
          <Link to="/" className="logo font-bold text-lg sm:text-xl">
            {logo.name}
          </Link>

          {/* Desktop Categories */}
          {isLarge && (
            <ul className="flex items-center font-medium text-gray-600">
              {mainCategory.map((category) => (
                <li
                  key={category.categoryId}
                  onMouseEnter={() => {
                    setSelectedCategory(category.categoryId);
                    setShowSheet(true);
                  }}
                  onMouseLeave={() => setShowSheet(false)}
                  className="hover:text-teal-500 cursor-pointer hover:border-b-2 h-16 px-4 border-teal-400 flex items-center"
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop / Tablet (sm and above) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <IconButton>
              <Search size={20} />
            </IconButton>

            <IconButton>
              <Heart size={20} />
            </IconButton>

            <IconButton onClick={() => navigate("/cart")}>
              <AddShoppingCart />
            </IconButton>

            {user.user?.name ? (
              <Button
                onClick={() => navigate("/account")}
                className="flex items-center gap-2"
                startIcon={
                  <Avatar
                    src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVufGVufDB8fDB8fHww"
                    className="text-xl"
                  />
                }
              >
                {user.user?.name}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth/login")}
                variant="contained"
                startIcon={<People />}
              >
                Login
              </Button>
            )}

            {user.user?.role === "customer" ? (
              <Button
              type="button"
                onClick={handelLogout}
                variant="contained"
                color="error"
                className="flex items-center justify-center"
              >
                <Logout />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/become-seller")}
                variant="contained"
                startIcon={<Storefront />}
              >
                Become Seller
              </Button>
            )}
          </div>

          {/* Mobile view (below sm) — only Login button */}
          <div className="flex  m-3 sm:hidden">
            {user.user?.name ? (
              <Button
                onClick={() => navigate("/account")}
                className="flex items-center gap-2 sm:p-5"
                startIcon={
                  <Avatar
                    src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVufGVufDB8fDB8fHww"
                    className="text-xl"
                  />
                }
              >
                {" "}
                Aditya{" "}
              </Button>
            ) : (
              <Button
              type="button"
                onClick={() => navigate("/auth/login")}
                variant="contained"
                startIcon={<People />}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Category Dropdown */}
      {isLarge && showSheet && (
        <div
          onMouseEnter={() => setShowSheet(true)}
          onMouseLeave={() => setShowSheet(false)}
          className="absolute top-16 left-20 right-20"
        >
          <CategorySheet
            selectCategory={selectedCategory}
            setShowSheet={setShowSheet}
          />
        </div>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box className="w-64 p-4 h-[85vh]">
          <List className="h-full  relative">
            {mainCategory.map((category) => (
              <ListItem key={category.categoryId} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(`/products/${category.categoryId}`);
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText primary={category.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
                onClick={handelLogout}
                variant="contained"
                color="error"
                startIcon={<Logout />}
                className="bg-red-500 absolute w-full"
              >
                Logout
              </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
