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
import { Gift, Heart, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../json/common";
import Lottie from "lottie-react";
import animation1 from "../../assets/animations/Shopping.json";
import animation2 from "../../assets/animations/ecommerce.json";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { performedLogout } from "../../Redux Toolkit/Features/Auth/AuthSlice";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import SearchProduct from "./SearchProduct";
import { fetchUserProfile } from "../../Redux Toolkit/Features/Customer/userSlice";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.user.user || {});
  const dispatch = useAppDispatch();
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [openDrawer, setOpenDrawer] = useState(false);
  const anim1Ref = useRef();
  const anim2Ref = useRef();
  const [active, setActive] = useState(1);
  const [showSearch, setShowSearch] = useState(false);

  const [navbarProfile, setNavbarProfile] = useState(null);

  const cart = useAppSelector((store) => store?.cart.cart?.cartItems);
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    // load first time
    const savedProfile = localStorage.getItem("profileImage");
    if (savedProfile) setNavbarProfile(savedProfile);

    // 🔥 LISTEN FOR REALTIME CHANGE
    const handleProfileUpdate = (e) => {
      setNavbarProfile(e.detail);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // 🔥 Fetch user profile on component mount
  const token = secureLocalStorage.getItem("token");
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

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
    navigate("/auth/login");
  };

  return (
    <Box className="sticky top-0 bg-white z-50 shadow-sm">
      {/* NAVBAR */}
      <div className="flex items-center justify-between h-16 px-2 overflow-hidden sm:px-10  lg:px-20">
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
            <IconButton onClick={() => setShowSearch(!showSearch)}>
              <Search size={20} />
            </IconButton>

            {token && user?.role === "customer" && (
              <IconButton onClick={() => navigate("/rewards")}>
                <Gift size={20} />
              </IconButton>
            )}

            {token && user?.role === "customer" && (
              <IconButton onClick={() => navigate("/favorites")}>
                <Heart size={20} />
              </IconButton>
            )}

            {token && user?.role === "customer" && (
              <IconButton
                className="relative"
                onClick={() => navigate("/cart")}
              >
                {cartCount > 0 && (
                  <span className="absolute bg-red-600 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 -top-1 -right-1 rounded-full">
                  {cartCount}
                </span>
                )}
                <AddShoppingCart />
              </IconButton>
            )}

            {user?.name ? (
              <nav
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {user?.name ? (
                  navbarProfile ? (
                    <span
                      onClick={() => navigate("/account")}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <img
                        src={navbarProfile}
                        alt="User"
                        style={{
                          width: "auto",
                          height: 50,
                          borderRadius: "50%",
                        }}
                      />
                      <p className="overflow-hidden text-ellipsis truncate">
                        {user?.name}
                      </p>
                    </span>
                  ) : (
                    <span
                      onClick={() => navigate("/account")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div>
                        <User size={20} color="#888" />
                      </div>
                      <p className="text-nowrap overflow-hidden text-ellipsis truncate">
                        {user?.name}
                      </p>
                    </span>
                  )
                ) : (
                  <button>
                    <People size={20} /> Login
                  </button>
                )}
              </nav>
            ) : (
              <Button
                onClick={() => navigate("/auth/login")}
                variant="contained"
                startIcon={<People />}
              >
                Login
              </Button>
            )}

            {user?.role === "customer" || user?.role === "admin" ? (
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
          <div className="flex items-center md:hidden lg:hidden">
            {user?.name ? (
              <>
                <Button
                  onClick={() => navigate("/account")}
                  className="flex items-center truncate text-ellipsis sm:hidden"
                  startIcon={
                    <Avatar
                      src={
                        secureLocalStorage.getItem("profileImage") ||
                        localStorage.getItem("profileImage")
                      }
                      alt={user?.name}
                      className="text-xl text-black"
                    />
                  }
                >
                  {user?.name ? user?.name.split(" ")[0] : "User"}
                </Button>
              </>
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

      {/* Search Input */}
      {showSearch && (
        <section className="fixed inset-0 z-50 flex items-start justify-center bg-white/10 backdrop-blur-sm px-3 sm:px-6 pt-16 sm:pt-24">
          <div
            className="
      w-full 
      max-w-2xl 
      bg-white/90 dark:bg-gray-900/10 
      rounded-lg 
      shadow-xl 
      p-4 sm:p-6 
      max-h-[80vh] 
      overflow-hidden
    "
          >
            <SearchProduct setShowSearch={setShowSearch} />
          </div>
        </section>
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
