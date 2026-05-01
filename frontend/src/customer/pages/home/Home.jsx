import { useEffect, lazy, Suspense } from "react";

const Gird = lazy(() => import("./Gird/Gird"));
const Deal = lazy(() => import("./Deal/Deal"));

const ElectronicCategory = lazy(
  () => import("./ElectronicCategory/electronicCategory"),
);
const HomeCategory = lazy(() => import("./HomeCategory/HomeCategory"));

const BottomBar = lazy(() => import("../../Navbar/BottomBar"));
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchHomePageData } from "../../../Redux Toolkit/Features/Customer/HomeCategorySlice";
import { Skeleton } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

  return (
    <div className="space-y-16 relative">
      {/* Electronic Category */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-4">Loading...</div>
        }
      >
        <ElectronicCategory />
      </Suspense>

      {/* Grid Section */}
      <section className="px-4 sm:px-6 lg:px-20">
        <Gird />
      </section>

      {/* Deals Section */}
      <section className="px-4 sm:px-6 lg:px-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Today's Deal
        </h1>
        <Deal />
      </section>

      {/* Shop By Category */}
      <section className="px-4 sm:px-6 lg:px-20">
        <HomeCategory />
      </section>

      {/* Become Seller Banner */}
      <section className="relative px-4 sm:px-6 lg:px-20">
        <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
          {/* Background Image */}
          <picture>
            {/* Laptop / Desktop */}
            <source
              loading="lazy"
              media="(min-width: 1024px)"
              srcSet="https://img.freepik.com/premium-photo/shopping-cart-with-pink-bag-bottom-is-shown-background_337384-104633.jpg"
            />

            {/* Mobile */}
            <img
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="w-full h-[250px] sm:h-[350px] lg:h-[450px] object-cover"
              src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074076.jpg"
              alt="Sell your product"
            />
          </picture>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-10 lg:px-20 space-y-4 ">
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold">
              Sell Your Product
            </h1>

            <p className="text-sm sm:text-lg lg:text-2xl font-medium">
              With{" "}
              <span className="logo text-xl sm:text-3xl lg:text-5xl">
                Easy.
              </span>
            </p>

            <button
              onClick={() => navigate("/become-seller")}
              className="flex items-center gap-1 px-1.5 py-2 border-2 border-green-500 border-dashed rounded-md hover:bg-green-700 transition duration-300"
            >
              <User size={22} />
              <span className="text-sm sm:text-base font-medium">
                Become Seller
              </span>
            </button>
          </div>
        </div>
      </section>

      <Suspense
        fallback={<Skeleton variant="rectangular" width={210} height={60} />}
      >
        <BottomBar />
      </Suspense>
    </div>
  );
};

export default Home;
