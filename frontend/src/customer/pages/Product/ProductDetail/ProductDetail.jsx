import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheckIcon,
  Bot,
  Camera,
  ChevronDown,
  Clock,
  Heart,
  ImageIcon,
  MessageCircle,
  Minus,
  Play,
  Plus,
  RefreshCcw,
  Share2,
  Shield,
  ShoppingCartIcon,
  Star,
  ThumbsUp,
  Truck,
  WalletCards,
  X,
  ChevronLeft,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SimilarProduct from "./SimilarProduct";
import PostForm from "./Posts/PostForm";
import TryNow from "./TryNow";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { useFormik } from "formik";
import { fetchProductById } from "../../../../Redux Toolkit/Features/Customer/productSlice";
import { useParams } from "react-router-dom";
import { addItemToCart } from "../../../../Redux Toolkit/Features/Customer/cartSlice";
import secureLocalStorage from "react-secure-storage";
import {
  createPost,
  fetchPosts,
} from "../../../../Redux Toolkit/Features/Customer/postsSlice";
import { useMemo } from "react";
import { TextField } from "@mui/material";
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary";
import { logo } from "../../../json/common";

// StarRating Component - Defined outside component
export const StarRating = ({ stars, size = "w-4 h-4" }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.round(stars || 0)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-200"
        }`}
      />
    ))}
  </div>
);

export function PostMediaGallery({ media }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(media.length / itemsPerPage);

  const currentMedia = media.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  if (!media || media.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 min-h-[18rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-wrap gap-6 w-full"
          >
            {currentMedia.map((mediaUrl, idx) => (
              <div
                key={idx}
                className="w-56 h-72 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-50 relative group"
              >
                {mediaUrl.match(/\.(mp4|webm|ogg)$/i) ||
                mediaUrl.includes("video") ? (
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    alt={`User Post ${idx}`}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex  justify-center items-center gap-2">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className={`p-1.5 rounded-full border ${
              currentIndex === 0
                ? "text-slate-200 border-slate-100"
                : "text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft size={14} />
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${i === currentIndex ? "w-4 bg-slate-900" : "w-1 bg-slate-200"}`}
              />
            ))}
          </div>
          <button
            disabled={currentIndex === totalPages - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className={`p-1.5 rounded-full border ${
              currentIndex === totalPages - 1
                ? "text-slate-200 border-slate-100"
                : "text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft size={14} className="rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}

const ProductDetail = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const { productId, categoryId } = useParams();
  const imgRefBox = useRef(null);
  const imgRef = useRef(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const token = secureLocalStorage.getItem("token");
  console.log(token);

  const { product, error } = useAppSelector((store) => store.products);
  const { user } = useAppSelector((store) => store.user?.user || {});
  const dispatch = useAppDispatch();

  const handleSubmit = async (values) => {
    const token = secureLocalStorage.getItem("token");

    try {
      // 1. resolve IDs safely (body OR fallback to params)
      const userId = values.user || user?._id;
      const product = values.product || productId;

      // 2. upload media to Cloudinary
      const uploadedMedia = values.posts.media?.length
        ? await Promise.all(
            values.posts.media.map((file) => uploadToCloudinary(file)),
          )
        : [];

      // 3. build payload
      const payload = {
        user: userId,
        product,
        title: values.posts.title,
        content: values.posts.content,
        rating: values.rating,
        media: uploadedMedia,
      };

      // 4. dispatch
      dispatch(
        createPost({
          token,
          payload,
        }),
      );
      formik.resetForm();
      setShowPostModal(false);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      product: productId,
      posts: {
        title: "",
        content: "",
        media: [],
      },
      rating: 0,
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    const token = secureLocalStorage.getItem("token");

    const controller = new AbortController();

    // optional: store last fetched id
    const lastProductId = fetchPosts.lastProductId;

    if (lastProductId === productId) return;

    fetchPosts.lastProductId = productId;

    dispatch(
      fetchPosts({
        token,
        productId,
        signal: controller.signal,
      }),
    );

    return () => {
      controller.abort(); // cancel previous request
    };
  }, [dispatch, productId]);

  const { posts } = useAppSelector((store) => store.posts);

  // Filter posts to show only similar/related products
  const filteredPosts = posts.filter((post) => {
    return (
      post?.productId === productId ||
      post?.product === productId ||
      post?.product?._id === productId
    );
  });

  // Show sizes only for clothing categories (men/women/kids).
  // Category can arrive as route slug, populated object, or plain id string.
  const getSizesByCategory = () => {
    const routeCategory = String(categoryId || "").toLowerCase();
    const productCategoryName = String(
      product?.category?.name || "",
    ).toLowerCase();
    const productCategoryId = String(
      product?.category?.categoryId ||
        product?.category?._id ||
        product?.category ||
        "",
    ).toLowerCase();

    const categorySignals = `${routeCategory} ${productCategoryName} ${productCategoryId}`;

    const clothingKeywords = [
      "men",
      "man",
      "male",
      "women",
      "woman",
      "female",
      "kids",
      "kid",
      "child",
      "children",
      "boys",
      "girls",
      "fashion",
      "wear",
      "cloth",
      "apparel",
      "saree",
      "dress",
      "shirt",
      "tshirt",
      "kurta",
      "jeans",
      "pant",
      "trouser",
      "top",
      "hoodie",
      "jacket",
    ];

    const isClothingCategory = clothingKeywords.some((keyword) =>
      categorySignals.includes(keyword),
    );

    return isClothingCategory
      ? ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
      : [];
  };

  const sizes = getSizesByCategory();
  const stockQuantity = Number(product?.quantity || 0);
  const isOutOfStock = stockQuantity <= 0;

  useEffect(() => {
    if (productId && (!product || product._id !== productId)) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  const addCartItem = () => {
    if (isOutOfStock) return;

    const request = {
      productId: product?._id,
      quantity: quantity,
      size: sizes.length > 0 && selectedSize ? selectedSize : "FREE",
    };

    dispatch(addItemToCart(request));
  };

  const images = Array.isArray(product?.images?.[0])
    ? product.images[0] // 2D array fix
    : product?.images || []; // fallback empty array

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorite")) || [],
  );

  const [showZoom, setShowZoom] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [bgPos, setBgPos] = useState("0% 0%");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const LENS_SIZE = 150;

  const handelCurrentImage = (index) => {
    setCurrentImage(index);
  };

  const handleChangeQuantity = (value) => {
    if (value === 0) {
      setQuantity(1);
      return;
    }

    setQuantity((prev) => {
      const newQty = prev + value;
      return newQty < 1 ? 1 : newQty;
    });
  };

  if (quantity <= 0) {
    throw new Error("Quantity must be 1.");
  }

  const showTryNow = () => {
    if (isOutOfStock) return;
    setShow((prev) => !prev);
  };

  // handle both stored ids and full objects when checking favorites
  const isFavorite = favorites.some((p) =>
    typeof p === "string" ? p === product?._id : p?._id === product?._id,
  );

  const handleFavorite = (prod) => {
    let updated = [...favorites];

    // determine existence whether favorites store ids or objects
    const exists = updated.some((p) =>
      typeof p === "string" ? p === prod._id : p?._id === prod._id,
    );

    if (exists) {
      // REMOVE any matching id or object
      updated = updated.filter((p) =>
        typeof p === "string" ? p !== prod._id : p?._id !== prod._id,
      );
    } else {
      // LIMIT CHECK
      if (updated.length >= 10) {
        alert("Max 10 products allowed");
        return;
      }

      // ADD full product object
      updated.push(prod);
    }

    setFavorites(updated);
    localStorage.setItem("favorite", JSON.stringify(updated));
  };

  // Share Logic with Dynamic OG/Twitter Tags
  const shareProduct = async () => {
    if (!product) return;

    try {
      // Use backend OG endpoint for proper meta tags
      const baseUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:5000/api" // Backend port
          : "https://your-api-domain.com"; // Production backend URL

      const ogUrl = `${baseUrl}/products/${product._id}/og`;

      // Share with OG tags from backend
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: ogUrl,
        });
      } else {
        // Fallback: Copy share URL to clipboard
        await navigator.clipboard.writeText(ogUrl);
        alert("Share URL copied to clipboard:\n" + ogUrl);
      }
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return; //
    const rect = imgRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShowCursor(true);
    setPos({ x, y });

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setBgPos(`${bgX}% ${bgY}%`);
  };

  const handleMouseMoveSquare = (e) => {
    const rect = imgRefBox.current.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPos({ x, y });
  };

  const handleLoadMore = () => {
    // Show 2 more reviews on each click
    setVisibleReviews((prev) => Math.min(prev + 2, filteredPosts.length));
  };

  const getRatingStats = (ratingArray) => {
    if (!ratingArray || !ratingArray.length) {
      return { average: 0, distribution: [0, 0, 0, 0, 0], total: 0 };
    }
    const total = ratingArray.length; // This is product.rating (array of objects with .stars)
    const sum = ratingArray.reduce((acc, r) => acc + (Number(r.stars) || 0), 0);
    const average = (sum / total).toFixed(1);

    // Calculate distribution based on product ratings
    const counts = [0, 0, 0, 0, 0];
    ratingArray.forEach((r) => {
      const s = Math.round(r.stars);
      if (s >= 1 && s <= 5) counts[5 - s]++;
    });
    const distribution = counts.map((c) => Math.round((c / total) * 100));

    return { average, distribution, total };
  };

  // Combine product ratings with community post ratings for a more accurate average
  const combinedRatings = useMemo(() => {
    const productRatings = Array.isArray(product?.ratings)
      ? product.ratings
      : [];
    const postRatings = filteredPosts
      .filter((post) => post.rating)
      .map((post) => ({ stars: post.rating }));

    const all = [...productRatings, ...postRatings];

    if (all.length === 0)
      return { average: 0, distribution: [0, 0, 0, 0, 0], total: 0 };

    const stats = getRatingStats(all);
    return stats;
  }, [product?.ratings, filteredPosts]);

  const ratingStats = combinedRatings;

  const handlePostSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  // console.log(rating); // 4.3

  if (error || !product) {
    return (
      <div className="text-center mt-20">
        <p>Loading...</p>

        {error && (
          <>
            <p className="text-red-500 mb-4">Failed to load product 😢</p>

            <button
              onClick={() => dispatch(fetchProductById(productId))}
              className="px-4 py-2 bg-teal-500 text-white rounded"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 items-start">
      {/* Upload Post Modal */}
      <PostForm
        formik={formik}
        showPostModal={showPostModal}
        setShowPostModal={setShowPostModal}
        product={product}
        handlePostSubmit={handlePostSubmit}
      />
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          {/* Modal Box */}
          <div
            className="
        relative w-full max-h-[95vh] overflow-hidden
        rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl
        sm:w-[min(920px,95vw)]
      "
          >
            {/* Close Button */}
            <X
              onClick={showTryNow}
              className="
          absolute right-3 top-3 z-20 cursor-pointer
          rounded-full bg-white/90 p-1 text-gray-700 shadow
          hover:bg-white
        "
            />

            {/* Content */}
            <div className="h-[95vh] sm:h-[90vh] overflow-hidden pt-10">
              <TryNow image={images[currentImage]} allImages={images} />
            </div>
          </div>
        </div>
      )}
      {/* Try Now Modal */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl h-[80vh] flex flex-col md:flex-row"
            >
              <button
                onClick={() => setShow(false)}
                className="absolute right-6 top-6 z-10 p-2 bg-white/80 rounded-full shadow-md"
              >
                <X />
              </button>
              <div className="flex-1 bg-slate-50 flex items-center justify-center p-10">
                <img
                  src={images[currentImage]}
                  className="max-h-full object-contain mix-blend-multiply rounded-2xl shadow-lg"
                  alt="Try"
                />
              </div>
              <div className="flex-1 p-12 flex flex-col justify-center gap-6">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
                  AI Neural Try-On
                </h2>
                <p className="text-slate-500">
                  Visualizing {product.title} on your dynamic profile.
                </p>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-full w-1/3 bg-teal-500"
                  />
                </div>
                <Button
                  onClick={showTryNow}
                  disabled={isOutOfStock}
                  variant="contained"
                  sx={{ py: 2, bgcolor: "#0f172a", borderRadius: 4 }}
                >
                  Initialize AR Camera
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-6 py-10 lg:px-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Gallery Section */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse lg:flex-row gap-6">
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentImage(idx)}
                    className={`relative w-20 h-20 lg:w-28 lg:h-28 flex-shrink-0 cursor-pointer rounded-3xl overflow-hidden border-2 transition-all p-1 bg-white ${currentImage === idx ? "border-teal-500 shadow-lg shadow-teal-50" : "border-slate-100"}`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-contain mix-blend-multiply"
                      alt="Thumb"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex-1 relative bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden h-[450px] lg:h-[650px] flex items-center justify-center group shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    ref={imgRef}
                    src={images[currentImage]}
                    onMouseEnter={() => setShowZoom(true)}
                    onMouseLeave={() => setShowZoom(false)}
                    onMouseMove={handleMouseMove}
                    className="max-h-full max-w-full p-12 object-contain mix-blend-multiply cursor-none"
                  />
                </AnimatePresence>

                <AnimatePresence>
                  {showZoom && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="hidden lg:block absolute pointer-events-none z-50 border-4 border-white shadow-2xl rounded-full bg-no-repeat bg-white"
                      style={{
                        width: LENS_SIZE,
                        height: LENS_SIZE,
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        transform: "translate(-50%, -50%)",
                        backgroundImage: `url(${images[currentImage]})`,
                        backgroundSize: "250%",
                        backgroundPosition: bgPos,
                        boxShadow:
                          "0 0 0 9999px rgba(0,0,0,0.05), 0 25px 50px -12px rgba(0,0,0,0.4)",
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute bottom-8 left-8 opacity-5 font-black text-6xl select-none pointer-events-none uppercase italic tracking-tighter">
                  {logo.name}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-24 self-start">
            <header className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  New Arrival
                </span>
                <span className="flex items-center gap-1.5 text-xs font-black text-amber-500">
                  <StarRating stars={ratingStats.average} size="w-3.5 h-3.5" />{" "}
                  {ratingStats.average} ({ratingStats.total} Ratings)
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter uppercase italic">
                {product.title}
              </h1>
              {stockQuantity > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Only {stockQuantity} left in stock!
                </p>
              )}
              {isOutOfStock && (
                <p className="text-sm text-red-500 mt-2">Out of stock</p>
              )}
              <p className="text-slate-500 leading-relaxed font-medium">
                {product.description}
              </p>
            </header>

            <div className="space-y-2">
              <div className="flex items-center gap-5">
                <span className="text-5xl font-black text-teal-600 tracking-tighter italic">
                  ₹{product.sellingPrice.toLocaleString()}
                </span>
                <div className="flex flex-col">
                  <span className="text-lg text-slate-300 line-through font-bold">
                    ₹{product.mrpPrice.toLocaleString()}
                  </span>
                  <span className="text-teal-600 text-xs font-black">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              </div>
            </div>

            {sizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(s)}
                      className={`w-14 h-14 rounded-2xl font-black transition-all border-2 text-sm ${selectedSize === s ? "bg-slate-900 border-slate-900 text-white shadow-xl" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {token && (
              <div className="flex items-center gap-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">
                  Quantity
                </h3>
                <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-sm">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleChangeQuantity(-1)}
                    className="p-3 text-slate-400 hover:text-slate-900"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="w-10 text-center font-black text-xl">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleChangeQuantity(1)}
                    className="p-3 text-slate-400 hover:text-slate-900"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addCartItem}
                  disabled={isOutOfStock}
                  className={`flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-slate-800 shadow-2xl
                    ${isOutOfStock ? "cursor-not-allowed bg-slate-300 hover:bg-slate-300 shadow-none" : ""}
                    `}
                >
                  <ShoppingCartIcon className="w-5 h-5" /> Add to Bag
                </motion.button>
                <motion.button
                  onClick={() => handleFavorite(product)}
                  className={`p-5 rounded-3xl border-2 transition-all ${isFavorite ? "bg-red-50 border-red-500 text-red-500" : "bg-white border-slate-100 text-slate-300"}`}
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? "fill-red-500" : ""}`}
                  />
                </motion.button>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShow(true)}
                  className={`flex-1 bg-white border-2 border-slate-900 text-slate-900 py-4 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-50
                    ${isOutOfStock ? "cursor-not-allowed bg-slate-300 hover:bg-slate-300 shadow-none" : ""}
                    `}
                >
                  <Bot className="w-5 h-5 text-teal-500" /> Virtual Fitting
                </motion.button>
                <motion.button
                  onClick={shareProduct}
                  className="p-5 rounded-3xl border-2 border-slate-100 text-slate-400 hover:text-slate-900"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* --- COMMUNITY POSTS & RATINGS SECTION --- */}
        <section className="mt-32 pt-20 border-t border-slate-100 items-start ">
          <div className="grid  grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-24 self-start">
              <div className="bg-slate-50  p-12 rounded-[3.5rem] text-center space-y-4">
                <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic">
                  {ratingStats.average}
                </h2>
                <div className="flex justify-center">
                  <StarRating stars={ratingStats.average} size="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Average Rating
                </p>
                <div className="space-y-4">
                  {ratingStats.distribution.map((percent, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-[10px] font-bold"
                    >
                      <span className="w-2">{5 - i}</span>
                      <Star size={12} className="fill-slate-900" />
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 20 }}
                          animate={{ width: `${percent}%` }}
                          className="h-full bg-slate-900"
                        />
                      </div>
                      <span className="w-8 text-right opacity-40">
                        {percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {token && (
                <div className="p-10 border-2 border-slate-100 rounded-[3rem] space-y-6">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter">
                    Share your look
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    Show the community how you style it.
                  </p>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Camera size={18} />}
                    sx={{
                      py: 2,
                      borderRadius: 4,
                      borderColor: "#f1f5f9",
                      color: "#0f172a",
                      fontWeight: "bold",
                    }}
                    onClick={() => setShowPostModal(true)}
                  >
                    Post My Style
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                  Community Posts
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-100 rounded-full">
                  {filteredPosts.length} Experiences
                </span>
              </div>

              <div className="space-y-10">
                {filteredPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-slate-400 text-lg font-semibold">
                      No posts yet for this product category.
                    </p>
                    <p className="text-slate-300 text-sm mt-2">
                      Be the first to share your experience!
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {filteredPosts.slice(0, visibleReviews).map((post) => (
                      <motion.div
                        key={post?._id || post?.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-50 hover:shadow-2xl transition-all"
                      >
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl">
                              {(post?.user?.name || "").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">
                                {post?.user?.name || "Anonymous"}
                              </h4>
                              <h5 className="font-black flex items-start gap-3 text-slate-900 text-lg uppercase tracking-tight">
                                {post?.title}
                                {(post.isEdited ||
                                  post.updatedAt > post.createdAt) && (
                                  <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border border-amber-100">
                                    Edited
                                  </span>
                                )}
                              </h5>
                              <div className="flex items-center gap-3 mt-1">
                                <StarRating
                                  stars={post.rating}
                                  size="w-3.5 h-3.5"
                                />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                  {post.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <BadgeCheckIcon size={16} className="text-teal-500" />
                        </div>

                        <p className="text-slate-600 leading-relaxed text-lg italic mb-8">
                          {post?.content}
                        </p>

                        <div className="flex items-center justify-center flex-wrap gap-4 mb-8">
                          <PostMediaGallery
                            media={
                              Array.isArray(post?.media) &&
                              post.media.length > 0
                                ? post.media
                                : post.images
                                  ? [post.images]
                                  : []
                            }
                          />
                        </div>

                        <div className="flex items-center gap-8 pt-8 border-t border-slate-50">
                          {/* <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                            <ThumbsUp size={16} /> {post.likes} Helpful
                          </button>

                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                            <MessageCircle size={16} /> Reply
                          </button> */}

                          {/* FIXED */}
                          <div className="ml-auto flex flex-col items-end gap-1">
                            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest flex items-center gap-1">
                              <Clock size={12} className="inline-block" />
                              {new Date(post.createdAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            {post.createdAt && (
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Created at:{" "}
                                {new Date(post.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {/* --- LOAD MORE LOGIC --- */}
                <div className="relative py-12 flex justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <Divider className="w-full" />
                  </div>
                  <AnimatePresence>
                    {visibleReviews < filteredPosts.length ? (
                      <motion.button
                        key="load-more"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLoadMore}
                        className="relative px-12 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-2xl z-10"
                      >
                        Load More Experience <Plus size={16} />
                      </motion.button>
                    ) : (
                      posts.length < 0 && (
                        <motion.button
                          key="show-less"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setVisibleReviews(2)}
                          className="relative px-12 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-sm z-10"
                        >
                          Show Less{" "}
                          <ChevronDown className="rotate-180" size={16} />
                        </motion.button>
                      )
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
