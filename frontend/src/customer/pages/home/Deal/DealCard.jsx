import { Star, ShoppingCart, Share2, HeartIcon, Heart } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const DealCard = ({ deal }) => {
  const [showLike, setShowLike] = useState(false);
  const [liked, setLiked] = useState(false);
  const timeoutRef = useRef(null);
  const lastTap = useRef(0);

  const copyTextToClipboard = async (text) => {
    if (!text) return;

    // Modern async clipboard API (requires secure context / permissions)
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!ok) throw new Error("Copy failed");
  };

  const handleTapLike = (e) => {
    // If user taps an interactive element (like icon buttons), don't treat it as a card tap.
    if (
      e?.target?.closest?.(
        "button, a, input, textarea, select, option, [role='button']"
      )
    ) {
      return;
    }

    // Use the event timestamp to avoid non-idempotent calls during render analysis.
    const now = e?.timeStamp ?? 0;
    const DOUBLE_PRESS_DELAY = 300; // 300ms for double tap

    if (lastTap.current && now && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      toggleLike(); // Fill heart
      setShowLike(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowLike(false);
      }, 800);
    }

    lastTap.current = now || lastTap.current;
  };
  // Share Logic
  const shareProduct = async () => {
    if (!deal) return;

    const url = window.location.href;

    try {
      // Works on supported mobile AND some desktop browsers.
      if (navigator.share) {
        await navigator.share({
          title: deal.name,
          text: deal.description || "Check this product!",
          url,
        });
        return;
      }

      // Fallback for all other browsers: copy link
      await copyTextToClipboard(url);
      alert("Link copied to clipboard! You can share it manually.");
    } catch (err) {
      console.error("Sharing failed:", err);

      // If share is cancelled/blocked or clipboard write fails, give a manual fallback.
      prompt("Copy this link:", url);
    }
  };

  // Double Click Like Logic
  const handleDoubleClick = () => {
    setLiked((prev) => !prev); // 🔥 Toggle like

    setShowLike(true);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setShowLike(false);
    }, 800);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  //like button fill
  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="shrink-0 px-3">
      <div
        onTouchEnd={handleTapLike} // for mobile double tap
        onDoubleClick={handleDoubleClick}
        className="
          relative

          touch-manipulation

          w-[280px] h-[420px]                /* Mobile */
          md:w-[340px] md:h-[500px]          /* Tablet */
          lg:w-[280px] lg:h-[420px]          /* Laptop Reset */

          rounded-3xl overflow-hidden
          shadow-lg hover:shadow-2xl
          transition-all duration-500
          group
        "
      >
        {/* Discount */}
        <span className="absolute z-20 m-3 px-3 py-1 text-xs font-semibold text-white border border-dashed rounded-lg backdrop-blur-sm bg-white/10">
          {deal.discount}% OFF
        </span>

        {/* Animated Like */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            z-30 pointer-events-none
            transition-all duration-300
            ${showLike ? "opacity-100 scale-100" : "opacity-0 scale-75"}
          `}
        >
          <HeartIcon className="w-24 h-24 text-white fill-white drop-shadow-2xl animate-pulse" />
        </div>

        {/* Image */}
        <img
          src={deal.image}
          alt={deal.name}
          loading="lazy"
          className="
            absolute inset-0 w-full h-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Hover Icons */}
        <div
          className="
    absolute top-5 right-5 z-20
    flex flex-col gap-3

    /* Mobile & Tablet: always visible */
    opacity-100 translate-x-0

    /* Laptop only hover */
    lg:opacity-0 lg:translate-x-2
    lg:group-hover:opacity-100 lg:translate-x-0

    transition-all duration-300
  "
        >
          <IconButton
            onClick={toggleLike}
            icon={
              <Heart
                size={18}
                className={`transition-all duration-300 ${
                  liked
                    ? "fill-pink-500 text-pink-500 scale-110"
                    : "fill-transparent border-black"
                }`}
              />
            }
          />
          <IconButton
            icon={<Star size={18} />}
            hover="hover:bg-yellow-400 hover:text-black"
          />
          <IconButton
            icon={<ShoppingCart size={18} />}
            hover="hover:bg-green-500 hover:text-white"
          />
          <IconButton
            icon={<Share2 size={18} />}
            onClick={shareProduct}
            hover="hover:bg-blue-500 hover:text-white"
          />
        </div>

        {/* Content */}
        <div
          className="
            absolute bottom-0 w-full
            p-6 md:p-8 lg:p-6
            text-white
          "
        >
          <h3 className="text-lg md:text-xl lg:text-lg font-semibold">
            {deal.name}
          </h3>

          <button
            className="
              mt-4 w-full
              bg-blue-600 py-2 rounded-xl font-semibold
              transition-all duration-300
              hover:bg-blue-700 hover:scale-105 active:scale-95
            "
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable Icon Button */
const IconButton = ({ icon, onClick, hover }) => (
  <button
    type="button"
    onTouchEnd={(e) => e.stopPropagation()}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    className={`
      bg-white/90 backdrop-blur-md
      p-3 rounded-full text-black
      transition-all duration-300
      hover:scale-110 shadow-md
      ${hover}
    `}
  >
    {icon}
  </button>
);

export default DealCard;
