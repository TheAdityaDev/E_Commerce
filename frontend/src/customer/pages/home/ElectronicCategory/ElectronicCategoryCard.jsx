import React from "react";
import { useNavigate } from "react-router-dom";

const ElectronicCategoryCard = ({ item }) => {
  
  const navigate = useNavigate();
  

  return (
    <div
      onClick={() => navigate(`/products/${item.categoryId}`)}
      className="
        flex flex-col items-center gap-2 sm:gap-3
        cursor-pointer flex-wrap
        w-16 sm:w-20 md:w-24 lg:w-18
        text-center
        group
      "
    >
      {/* Image */}
      <div className="w-full aspect-square flex items-center justify-center">
        <img
          fetchPriority="high"
          className="
            object-contain
            w-12 h-12
            sm:w-16 sm:h-16
            md:w-20 md:h-20
            lg:w-24 lg:h-24
            rounded-xl
            transition-transform duration-300
            group-hover:scale-110
          "
          src={item.image}
          alt={item.name}
        />
      </div>

      {/* Name */}
      <h2 className="font-medium text-xs sm:text-sm md:text-base">
        {item.name}
      </h2>
    </div>
  );
};

export default ElectronicCategoryCard;
