import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DOT_SIZE = 8;
const GAP = 8;
const EXPANDED = 24;

const ProductCard = ({ item }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const startX = useRef(0);

  const goNext = () => {
    setIsAnimating(true);
    setCurrentImage((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const startSlider = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(goNext, 1500);
  };

  const stopSlider = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
  };

  const goToSlide = (index) => {
    if (index === currentImage) return;
    setIsAnimating(true);
    setCurrentImage(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

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

  return (
    <div
      onClick={() => navigate(`/products/${1}/men-shirt/${2}`)}
      className="group w-70 rounded-xl max-w-sm mx-auto cursor-pointer lg:w-full p-2"
    >
      {/* Image Slider */}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden rounded-xl"
        onMouseEnter={startSlider}
        onMouseLeave={stopSlider}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {item.images.map((img, index) => (
          <img
          loading="lazy"
            key={index}
            src={img}
            alt=""
            className="absolute h-full w-full object-cover transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
            }}
          />
        ))}

        {/* Pagination Dots */}
        {/* Pagination */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 ">
          {item.images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // prevent card navigation
                goToSlide(index);
              }}
              className={`
        h-2 rounded-full transition-all duration-300
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

        <p className="text-sm text-gray-600 truncate">Adidas shoes</p>

        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span className="font-semibold text-teal-600">₹2999</span>
          <span className="text-gray-400 line-through">₹3500</span>
          <span className="text-green-600 font-medium">35% off</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
