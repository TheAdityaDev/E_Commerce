import React, { useRef, useState, useEffect } from "react";
import ElectronicCategoryCard from "./ElectronicCategoryCard";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { useAppSelector } from "../../../../Redux Toolkit/store";

const ElectronicCategory = () => {
  const homeCategories = useAppSelector(
    (store) => store?.homeCategory?.homeCategories,
  );

  const scrollRef = useRef(null);

  const [showButtons, setShowButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ✅ Check item count
  useEffect(() => {
    if (homeCategories && homeCategories.length > 10) {
      setShowButtons(true);
    } else {
      setShowButtons(false);
    }
  }, [homeCategories]);

  // ✅ Handle scroll state
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScrollLeft);
  };

  // ✅ Scroll function
  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = Math.max(240, Math.round(el.clientWidth * 0.8));

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };


  return (
    <div className="relative w-full border-b sm:py-5">
      
      {/* ✅ Arrow Buttons (Only if > 10 items) */}
      {showButtons && (
        <div className="hidden lg:flex absolute top-15 items-center gap-5 justify-between left-0 right-0 lg:px-8 xl:px-5 z-10 pointer-events-none">
          
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`pointer-events-auto cursor-pointer p-1 rounded-xl backdrop-blur-sm 
              ${canScrollLeft ? "bg-gray-500/30 hover:bg-gray-500/50" : "bg-gray-300/20 cursor-not-allowed"}
            `}
          >
            <ArrowLeft className="text-white" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`pointer-events-auto cursor-pointer p-1 rounded-xl backdrop-blur-sm 
              ${canScrollRight ? "bg-gray-500/30 hover:bg-gray-500/50" : "bg-gray-300/20 cursor-not-allowed"}
            `}
          >
            <ArrowRight className="text-white" />
          </button>
        </div>
      )}

      {/* ✅ Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        role="region"
        aria-label="Electronics categories"
        className="flex flex-nowrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scroll-smooth px-3 sm:px-4 md:px-6 lg:px-10 xl:px-20 w-full snap-x snap-mandatory"
      >
        {homeCategories?.map((item, i) => (
          <div
            key={i}
            className="shrink-0 w-20 sm:w-24 md:w-32 lg:w-40 xl:w-30"
          >
            <ElectronicCategoryCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectronicCategory;