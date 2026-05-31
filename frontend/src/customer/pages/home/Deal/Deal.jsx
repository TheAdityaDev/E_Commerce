import React, { useState, useEffect, useRef } from "react";
import DealCard from "./DealCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import {
  fetchDeals,
} from "../../../../Redux Toolkit/Features/Admin/dealSlice";
import secureLocalStorage from "react-secure-storage";

const Deal = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    if (token) {
      dispatch(fetchDeals(token));
    }
  }, [dispatch]);

  // Fetch deals from Redux store
  const { deals, loading, error } = useAppSelector((store) => store.deal);

  // Log errors for debugging
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  // Transform Redux deals to match DealCard format
  // Handle both array and object responses from backend
  const dealsArray = Array.isArray(deals?.deals)
    ? deals.deals
    : Array.isArray(deals)
    ? deals
    : [];

  const dealsData = dealsArray.map((deal) => ({
    image: deal.productImage || deal.image,
    name: deal.productName || deal.name,
    discount: deal.discountPercentage?.toString() || "0",
    id: deal._id || deal.id,
    productId: deal.product?._id || deal.productId
  }));

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(4);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const touchStartedOnInteractive = useRef(false);

  // Responsive visible cards (Mobile / Tablet / Laptop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1); // 📱 Mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2); // 📲 Tablet
      } else {
        setVisibleCards(4); // 💻 Laptop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = dealsData.length - visibleCards;

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  // 🔥 TOUCH HANDLERS
  const handleTouchStart = (e) => {
    const t = e.targetTouches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;

    // Initialize end positions so a "tap" doesn't look like a swipe.
    touchEndX.current = t.clientX;
    touchEndY.current = t.clientY;

    // If the user started on a button/icon, don't treat it as a swipe.
    touchStartedOnInteractive.current = Boolean(
      e.target?.closest?.(
        "button, a, input, textarea, select, option, [role='button']",
      ),
    );
  };

  const handleTouchMove = (e) => {
    const t = e.targetTouches[0];
    touchEndX.current = t.clientX;
    touchEndY.current = t.clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartedOnInteractive.current) return;

    const dx = touchStartX.current - touchEndX.current;
    const dy = touchStartY.current - touchEndY.current;

    // Ignore small moves (tap) and mostly-vertical scroll gestures.
    if (Math.abs(dx) < 50) return;
    if (Math.abs(dy) > Math.abs(dx)) return;

    if (dx > 0)
      next(); // Swipe Left
    else prev(); // Swipe Right
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return; // Only for desktop
    const { clientX } = e;
    const { innerWidth } = window;
    const threshold = innerWidth * 0.15; // 15% from edges

    if (clientX < threshold) {
      prev();
    } else if (clientX > innerWidth - threshold) {
      next();
    }
  };

  console.log("Deal data:",dealsData)

  return (
    <div className="relative w-full py-10">
      {/* LEFT ARROW */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10
        bg-black/40 text-white p-3 rounded-full
        hover:scale-110 transition disabled:opacity-30"
      >
        <ChevronLeft size={28} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={next}
        disabled={index === maxIndex}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10
        bg-black/40 text-white p-3 rounded-full
        hover:scale-110 transition disabled:opacity-30"
      >
        <ChevronRight size={28} />
      </button>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading deals...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading deals: {error}</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && dealsData.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No deals available</p>
        </div>
      )}

      {/* VIEWPORT */}
      {!loading && dealsData.length > 0 && (
        <div
          className="overflow-hidden w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {dealsData.map((deal) => (
              <div
                key={deal._id || deal.id}
                className="flex justify-center shrink-0"
                style={{ width: `${100 / visibleCards}%` }}
              >
                <DealCard deal={deal} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGINATION DOTS */}
      {!loading && dealsData.length > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300
              ${i === index ? "w-8 bg-blue-600" : "w-2 bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Deal;
