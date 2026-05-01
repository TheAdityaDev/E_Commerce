import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  const startX = useRef(0);

  // const dispatch = useAppDispatch();

  const navigate = useNavigate();

  // Move to next slide
  const goNext = () => {
    if (!item?.images?.length) return;
    setIsAnimating(true);
    setCurrentImage((prev) => (prev + 1) % item.images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Start auto-slider
  const startSlider = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(goNext, 1500);
  };

  // Stop auto-slider
  const stopSlider = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
  };

  // Jump to specific slide (dot click)
  const goToSlide = (index) => {
    if (index === currentImage) return;
    setIsAnimating(true);
    setCurrentImage(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;

    if (startX.current - endX > 50) goNext();

    if (endX - startX.current > 50) {
      setIsAnimating(true);
      setCurrentImage((prev) =>
        prev === 0 ? item.images.length - 1 : prev - 1,
      );
      setTimeout(() => setIsAnimating(false), 500);
    }
  };



  // Ensure images is a 1D array

  return (
    <div
      onClick={() =>
        navigate(`/products/${item.category}/${item.title}/${item._id}`)
      }
      className="group w-70 rounded-xl max-w-sm mx-auto cursor-pointer lg:w-full p-2"
    >
      {/* Image Slider */}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden rounded-xl"
        onMouseEnter={startSlider} // Auto play on hover
        onMouseLeave={stopSlider} // Stop on hover leave
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {item.images.map((img, index) => (
          <img
            key={index}
            src={img} // ✅ single URL
            alt={item.title}
            fetchPriority="high"
            loading="eager"
            className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-700"
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
            }}
          />
        ))}

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {item.images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // prevent card navigation
                goToSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300
                ${currentImage === index ? "w-6 bg-green-400" : "w-2 bg-white/80"}
              `}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2 bg-gray-100 p-4 rounded-lg border border-black overflow-hidden">
        <h2 className="text-sm sm:text-base font-semibold truncate">
          {item.seller.businessDetails?.businessName}
        </h2>
        <p className="text-sm text-gray-600 truncate">{item.title}</p>
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span className="font-semibold text-teal-600">
            ₹{item.sellingPrice}
          </span>
          <span className="text-gray-400 line-through">₹{item.mrpPrice}</span>
          <span className="text-green-600 font-medium">
            {item.discountPercentage}% off
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
