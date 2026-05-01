import { IconButton, Tooltip } from "@mui/material";
import { Star, ShoppingCart, Share, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

/**
 * Individual Category Card Component
 */
const HomeCategoryCard = ({ category, onToggleStar }) => {
  if (!category) return null;

const navigate = useNavigate()


  // Use actual data keys
  const { categoryId: id, name, isStarred, image } = category;

  // ✅ Click handler
  const handleClickStar = (e) => {
    e.stopPropagation();

    const token = secureLocalStorage.getItem("token");
    const role = secureLocalStorage.getItem("role");

    if (!token || role !== "customer") {
      toast.warn(
        <div className="flex w-full items-center gap-15">
          <p>Please login first</p>
          <Link
          to="/auth/login"
            onClick={() => {;
              toast.dismiss(); // closes this toast
            }}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm active:scale-110"
          >
            Login
          </Link>
        </div>
      );
      return; // stop execution
    }

    // ✅ Call parent toggle function
    onToggleStar(id);
  };

  return (
    <div className="flex flex-col items-center gap-3 group cursor-pointer w-full sm:w-[160px] md:w-[180px] lg:w-[220px]">
      {/* Image Container */}
      <div
        className={`w-full relative aspect-square border-2 ${
          isStarred ? "border-yellow-400 bg-yellow-50/30" : "border-gray-300"
        } p-2 border-dashed rounded-xl overflow-hidden transition-all duration-300`}
      >
        {/* Quick-Action Star */}
        <button
          onClick={handleClickStar}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-sm transition-all duration-300 
            ${
              isStarred
                ? "bg-red-400 text-white cursor-pointer scale-110"
                : "bg-white/80 text-gray-400 cursor-pointer hover:text-yellow-500 opacity-0 group-hover:opacity-100"
            }`}
        >
          {isStarred ? (
            <Trash2 size={18} fill={isStarred ? "none" : "currentColor"} />
          ):(
          <Star size={18} fill={isStarred ? "currentColor" : "none"} />
          )}
        </button>

        {/* Image */}
        <img
        onClick={() => navigate(`/products/${category.categoryId}`)}
          loading="lazy"
          className={`w-full h-full object-cover rounded-xl transition-transform duration-500 ${
            isStarred ? "scale-105" : "group-hover:scale-110"
          }`}
          src={image}
          alt={name}
        />

        {/* Overlay Controls */}
        <div
          className="
          absolute left-1/2 -translate-x-1/2
          w-[90%] md:w-[85%]
          rounded-md
          bg-gray-900/80 backdrop-blur-md
          h-12 md:h-14
          flex items-center justify-center
          transition-all duration-300
          bottom-3              
          sm:-bottom-20         
          sm:group-hover:bottom-4
          z-10
          "
        >
          <div className="flex gap-2 md:gap-3">
            <Tooltip title="Share">
              <IconButton size="small" className="text-white hover:bg-blue-500">
                <Share size={18} />
              </IconButton>
            </Tooltip>

            <Tooltip title={isStarred ? "Remove Priority" : "Move to Top"}>
              <IconButton
                size="small"
                onClick={handleClickStar} // ✅ Same handler
                className={`${isStarred ? "text-yellow-400" : "text-white"} hover:text-yellow-400`}
              >
                <Star size={18} fill={isStarred ? "currentColor" : "none"} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add to Cart">
              <IconButton
                size="small"
                className="text-white hover:bg-green-500"
              >
                <ShoppingCart size={18} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1
        className={`text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-center transition-colors ${
          isStarred ? "text-yellow-700" : "text-gray-800"
        }`}
      >
        {name}
      </h1>
    </div>
  );
};

export default HomeCategoryCard;
