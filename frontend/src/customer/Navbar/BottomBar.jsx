import { AddShoppingCart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Heart, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
  const [visible, setVisible] = useState(true);
  const scrollTimeout = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Hide bar when scrolling
      setVisible(false);

      // Clear previous timeout
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      // Show bar 500ms after user stops scrolling
      scrollTimeout.current = setTimeout(() => {
        setVisible(true);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);
  return (
    <section
      className={`
        fixed bottom-0 left-0 z-50 w-full h-16 flex items-center justify-around 
        bg-teal-500 sm:hidden transition-transform duration-300
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <IconButton>
        <Search size={24} className="text-white" />
      </IconButton>

      <IconButton>
        <Heart size={24} className="text-white" />
      </IconButton>

      <IconButton onClick={() => navigate("/cart")}>
        <AddShoppingCart size={24} className="text-white" />
      </IconButton>
    </section>
  );
};

export default BottomBar;
