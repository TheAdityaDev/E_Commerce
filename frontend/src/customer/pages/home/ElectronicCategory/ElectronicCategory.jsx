import React, { useRef } from "react";
import { electronics } from "../../../json/items";
import ElectronicCategoryCard from "./electronicCategoryCard";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";

const ElectronicCategory = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const amount = Math.max(240, Math.round(scrollRef.current.clientWidth * 0.8));
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });

    // Disable arrow buttons on scroll
    scrollRef.current.addEventListener("scroll", () => {
      const scrollLeft = scrollRef.current.scrollLeft;
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollbarWidth = scrollWidth - clientWidth;


      const leftButton = document.querySelector("button[aria-label='Scroll left']");
      const rightButton = document.querySelector("button[aria-label='Scroll right']");


      if (scrollLeft <= 0) {
        leftButton.style.pointerEvents = "none";
      } else {
        leftButton.style.pointerEvents = "auto";
      }

      if (scrollLeft >= scrollbarWidth) {
        rightButton.style.pointerEvents = "none";
      } else {
        rightButton.style.pointerEvents = "auto";
      }
    });
  };

  return (
    <div className="relative w-full border-b sm:py-5">

      {/* Arrow Buttons (Desktop Only) */}
      <div className="hidden lg:flex absolute top-15 items-center gap-5 justify-between left-0 right-0  lg:px-8 xl:px-5 z-10 pointer-events-none">
        <button
          onClick={() => scroll("left")}
          type="button"
          aria-label="Scroll left"
          className="pointer-events-auto cursor-pointer bg-gray-500/30 hover:bg-gray-500/50 p-1 rounded-xl backdrop-blur-sm"
        >
          <ArrowLeft className="text-white" />
        </button>

        <button
          onClick={() => scroll("right")}
          type="button"
          aria-label="Scroll right"
          className="pointer-events-auto cursor-pointer bg-gray-500/30 hover:bg-gray-500/50 p-1 rounded-xl backdrop-blur-sm"
        >
          <ArrowRight className="text-white" />
        </button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="Electronics categories"
        className="flex flex-nowrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scroll-smooth px-3 sm:px-4 md:px-6 lg:px-10 xl:px-20 w-full snap-x snap-mandatory scroll-px-3 sm:scroll-px-4 md:scroll-px-6 lg:scroll-px-10 xl:scroll-px-20"
      >
        {electronics.map((item, i) => (
          <div
            key={i}
            className="shrink-0 w-20 text-nowrap sm:w-24 md:w-32 lg:w-40 xl:w-30 snap-start"
          >
            <ElectronicCategoryCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectronicCategory;