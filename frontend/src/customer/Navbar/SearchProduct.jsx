import { TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { searchProduct } from "../../Redux Toolkit/Features/Customer/productSlice";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, X } from "lucide-react";

const SearchProduct = ({ setShowSearch }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(true); // typing or deleting
  const charIndexRef = useRef(0);
  const requestRef = useRef();

  // placeHolders
  const placeholderTexts = [
    "Search for products 🛍️",
    "Search for brands 🏷️",
    "Find deals 💰",
    "Explore categories 📦",
  ];

  const typingSpeed = 100; // ms per char
  const deletingSpeed = 50; // faster when deleting
  const pauseDuration = 1000; // pause after typing full text

  // ✅ correct selector
  const { searchResults } = useAppSelector((store) => store?.products);

  const formik = useFormik({
    initialValues: {
      search: "",
    },
  });

  const animate = () => {
    const fullText = placeholderTexts[currentTextIndex];

    if (typing) {
      // typing forward
      if (charIndexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndexRef.current + 1));
        charIndexRef.current += 1;
        requestRef.current = setTimeout(animate, typingSpeed);
      } else {
        // pause before deleting
        setTyping(false);
        requestRef.current = setTimeout(animate, pauseDuration);
      }
    } else {
      // deleting backward
      if (charIndexRef.current > 0) {
        setDisplayedText(fullText.slice(0, charIndexRef.current - 1));
        charIndexRef.current -= 1;
        requestRef.current = setTimeout(animate, deletingSpeed);
      } else {
        // move to next text
        setCurrentTextIndex((prev) => (prev + 1) % placeholderTexts.length);
        setTyping(true);
        requestRef.current = setTimeout(animate, typingSpeed);
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    animate();
    return () => clearTimeout(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTextIndex]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const query = formik.values.search.trim();

      if (query) {
        setLoading(true);

        dispatch(searchProduct(query)).finally(() => {
          setLoading(false);
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formik.values.search, dispatch]);

  // trends list
  const trendingSearches = [
    "iPhone 16 Pro",
    "Samsung Galaxy S25",
    "AI Smart Glasses",
    "Wireless Earbuds Noise Cancelling",
    "Gaming Laptop RTX 4060",
    "Mechanical Keyboard RGB",
    "Oversized T-shirts",
    "Cargo Pants for men",
    "Athleisure wear",
    "Smart Watch with AMOLED display",
    "Bluetooth Speaker waterproof",
    "Home Workout Equipment",
    "Protein Powder Whey Isolate",
    "LED Strip Lights for room",
    "4K Monitor for work",
    "Tablet for students",
    "Electric Scooter",
    "Minimalist Sneakers",
    "Backpack for travel",
    "Office chair ergonomic",
  ];

  const handleTrendingClick = (value) => {
    formik.setFieldValue("search", value);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-16 px-3">
      <X
        onClick={() => setShowSearch(false)}
        size={30}
        className="cursor-pointer absolute top-10 bg-white/10 rounded-md text-gray-800 right-10 hover:text-white transition-colors p-1 active:scale-95"
      />
      <div className="w-full max-w-2xl">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 shadow-lg text-white px-5">
          <Search size={20} className="text-gray-400" />

          <TextField
            fullWidth
            size="small"
            className="border-none text-white placeholder:text-gray-600 focus:ring-0"
            placeholder={displayedText || "Search Product..."}
            name="search"
            enterKeyHint="search"
            // helperText="Search least trends... 🔍"
            type="search"
            autoCorrect="true"
            autoFocus
            autoComplete="off"
            value={formik.values.search}
            onChange={formik.handleChange}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent", // default border
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // ❌ removes blue border
                },
              },
            }}
          />

          <X
            onClick={() => formik.setFieldValue("search", "")}
            size={22}
            className={`cursor-pointer text-gray-400 hover:text-gray-600 transition-opacity ${formik.values.search ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          />
        </div>

        {/* Results Container */}
        <div className="mt-3 bg-gray-900 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
          {/* 🔄 LOADING STATE */}
          {loading && (
            <div className="p-3 space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 bg-gray-700 rounded-md"></div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ✅ RESULTS */}
          {!loading &&
            searchResults?.length > 0 &&
            searchResults.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  setShowSearch(false);
                  navigate(`/products/${item.title}/${item.title}/${item._id}`);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition"
              >
                <img
                  className="h-10 w-10 rounded-md object-cover"
                  src={item.images[0]}
                  alt={item.title}
                />

                <div className="flex flex-col flex-1 overflow-hidden">
                  <h1 className="text-sm text-gray-200 truncate">
                    {item.title}
                  </h1>
                  <p className="text-xs text-gray-400 truncate">
                    {item.description}
                  </p>
                </div>

                <TrendingUp size={16} className="text-gray-400" />
              </div>
            ))}

          {/* ❌ NO RESULTS */}
          {!loading && formik.values.search && searchResults?.length === 0 && (
            <p className="p-3 text-gray-400 text-sm">No results found</p>
          )}

          {/* 💡 DEFAULT SUGGESTIONS */}
          {!formik.values.search && (
            <div className="p-4">
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                🔥 Trending Searches
              </p>

              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((item, index) => (
                  <span
                    key={index}
                    onClick={() => handleTrendingClick(item)}
                    className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-full cursor-pointer hover:bg-gray-700 hover:text-white transition"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
