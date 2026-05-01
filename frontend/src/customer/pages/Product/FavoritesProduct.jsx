import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
  Share2,
  Sparkles,
  Zap,
  X,
  Check,
  Download,
  Palette,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logo, logoImage } from "../../json/common";

const FavoritesProduct = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedForShare, setSelectedForShare] = useState([]);
  const [qrColor, setQrColor] = useState("000000"); // Black default
  const canvasRef = useRef(null);

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorite")) || [],
  );
  const navigate = useNavigate();

  

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorite")) || [];
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item._id !== id);
    setFavorites(updated);
    localStorage.setItem("favorite", JSON.stringify(updated));
  };

  const colors = [
    { name: "Black", hex: "000000" },
    { name: "Royal Purple", hex: "a855f7" },
    { name: "Neon Blue", hex: "3b82f6" },
    { name: "Sunset Rose", hex: "ec4899" },
    { name: "Emerald", hex: "10b981" },
  ];

  const toggleShareSelection = (id) => {
    setSelectedForShare((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Helper to generate the URL for the QR code
  const getShareUrl = () => {
    const baseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:5173"
        : "https://bcw49lr2-5173.inc1.devtunnels.ms";
    if (selectedForShare.length === 0) return `${baseUrl}/ram-mart`;
    if (selectedForShare.length === 1)
      return `${baseUrl}/product/${selectedForShare[0]}`;
    // For multiple products, we send a query param of IDs
    return `${baseUrl}/products?ids=${selectedForShare.join(",")}`;
  };

  const downloadWithWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const qrImage = new Image();

    const shareUrl = getShareUrl();
    qrImage.crossOrigin = "anonymous";
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl || `${logo.name}`)}&color=${qrColor}`;

    qrImage.onload = () => {
      // Clear canvas
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR Code
      ctx.drawImage(qrImage, 0, 0, 400, 400);

      // Add "Hidden" Watermark (Low Opacity)
      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Very faint watermark
      ctx.textAlign = "center";

      // Repeat watermark across canvas
      for (let i = 0; i < 400; i += 100) {
        for (let j = 0; j < 400; j += 50) {
          ctx.save();
          ctx.translate(i, j);
          ctx.rotate(-Math.PI / 4);
          ctx.fillText(`${logo.name}`, 0, 0);
          ctx.restore();
        }
      }

      // Trigger Download
      const link = document.createElement("a");
      link.download = "ram-mart-share-qr.png";
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  return (
    <div className="min-h-screen bg-[#fff] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest uppercase text-xs mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Premium Collection</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">
              CURATED{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                LIST
              </span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setSelectedForShare(favorites.map((f) => f._id));
                setIsShareModalOpen(true);
              }}
              className="h-14 w-14 rounded-full border border-black flex items-center justify-center hover:bg-purple-600 hover:border-transparent transition-all duration-500 group"
            >
              <Share2 className="w-5 h-5 text-black  group-hover:scale-110" />
            </button>
          </div>
        </header>

        {/* Grid */}
        <main>
          <AnimatePresence mode="popLayout">
            {favorites.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
              >
                {favorites.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="group relative flex flex-col md:flex-row bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/50 transition-all duration-500"
                  >
                    {/* Image Section */}
                    <div className="relative w-full md:w-2/5 aspect-square md:aspect-auto overflow-hidden cursor-pointer">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="relative flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <motion.div
                            className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            layoutId={`line-${item._id}`}
                          />
                          <div className="flex gap-2">
                            {/* <button
                              onClick={() => {
                                setSelectedForShare((prev) =>
                                  prev.includes(item._id)
                                    ? prev.filter((i) => i !== item._id)
                                    : [...prev, item._id]
                                );
                              }}
                              className={`p-2 rounded-full transition-colors ${
                                selectedForShare.includes(item._id)
                                  ? "bg-purple-500 text-white"
                                  : "text-gray-500 hover:bg-white/5"
                              }`}
                            >
                              <Check className="w-4 h-4" />
                            </button> */}
                            <button
                              onClick={() => removeFavorite(item._id)}
                              className="text-gray-500 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-1 group-hover:text-purple-400 transition-colors truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-mono text-gray-400">
                            4.5 / 5.0
                          </span>
                        </div>

                        <div className="text-3xl font-black tracking-tighter mb-8">
                          ₹{item.sellingPrice}
                        </div>

                        <div className="text-sm text-gray-400 mb-6">
                          {item.description.length > 50 ? (
                            <p className="text-sm text-gray-400 line-clamp-4 overflow-hidden">
                              {item.description}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 overflow-hidden">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-auto z-10">
                        <button
                          onClick={() =>
                            navigate(
                              `/products/${item.category}/${item.title}/${item._id}`,
                            )
                          }
                          className="flex-1 h-12 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all duration-300 active:scale-95"
                        >
                          <Info className="w-4 h-4" />
                          Details
                        </button>
                        {/* Detail Button */}
                        {/* <button
                          onClick={() =>
                            navigate(
                              `/products/${item.category}/${item.title}/${item._id}`
                            )
                          }
                          className="h-12 bg-white/5 px-6 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-all"
                        >
                          Details
                        </button> */}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-20 text-center">
                <Heart className="mx-auto w-16 h-16 text-gray-800 mb-6" />
                <h2 className="text-3xl font-bold">List Khali Hai</h2>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {favorites.length > 0 ? (
                <>
                  {/* Product Selection List */}
                  <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-black italic tracking-tighter">
                        Select to <span className="text-purple-500">Share</span>
                      </h2>
                      <button
                        onClick={() => setIsShareModalOpen(false)}
                        className="p-2 hover:bg-white/5 rounded-full"
                      >
                        <X />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {favorites.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleShareSelection(item._id)}
                          className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${selectedForShare.includes(item.id) ? "bg-purple-500/10 border border-purple-500/30" : "bg-white/5 border border-transparent hover:border-white/10"}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedForShare.includes(item._id) ? "bg-purple-500 border-purple-500" : "border-white/20"}`}
                          >
                            {selectedForShare.includes(item._id) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <img
                            src={item.images[0]}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              ₹{item.sellingPrice}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QR Preview Section */}
                  <div className="w-full md:w-[350px] bg-white/5 p-8 flex flex-col items-center justify-center text-center">
                    <div className="mb-8">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4 font-bold">
                        Live QR Preview
                      </p>
                      <div className="relative p-4 bg-white rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedForShare.length > 0 ? selectedForShare.join(",") : `${logo.name}`)}&color=${qrColor}`}
                          className="w-48 h-48"
                          alt="QR Code"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-lg">
                          <img
                            className="h-10 w-10 rounded-md"
                            src={logoImage.image}
                            alt={logoImage.alt}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color Pickers */}
                    <div className="flex gap-2 mb-10">
                      {colors.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setQrColor(c.hex)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${qrColor === c.hex ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50"}`}
                          style={{ backgroundColor: `#${c.hex}` }}
                          title={c.name}
                        />
                      ))}
                    </div>

                    <button
                      onClick={downloadWithWatermark}
                      className="w-full h-14 bg-white text-black font-black italic rounded-2xl flex items-center justify-center gap-3 hover:bg-purple-500 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      <Download className="w-5 h-5" />
                      Download QR
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full bg-black relative p-10">
                  <div className="flex uppercase items-center justify-center gap-6">
                    <p>Your Product List is empty</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} width="400" height="400" className="hidden" />
    </div>
  );
};

export default FavoritesProduct;
