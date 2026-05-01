import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Wand2,
  ShieldCheck,
} from "lucide-react";
// axios import removed; use axiosInstance configured for your frontend
import { logo } from "../../../json/common";
import { axiosInstance } from "../../../../config/api.config";

// Environment provides keys
const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_KEY || API_KEY;

const TryNow = ({ image, allImages }) => {
  const [sourceImage, setSourceImage] = useState(image || "");
  const [currentImage, setCurrentImage] = useState(0);
  const [userImage, setUserImage] = useState(null);
  const [userImageBase64, setUserImageBase64] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const previousObjectUrlRef = useRef(null);
  useEffect(() => {
    // Prefer explicit `image` prop, otherwise fallback to first of `allImages`.
    const initial =
      image || (allImages && allImages.length ? allImages[0] : "");
    if (initial) {
      // Ensure absolute URL for backend fetches
      const absolute =
        initial.startsWith("http") || initial.startsWith("data:")
          ? initial
          : new URL(initial, window.location.origin).href;
      setSourceImage(absolute);
      const idx = allImages?.indexOf(initial);
      setCurrentImage(typeof idx === "number" && idx >= 0 ? idx : 0);
    }
  }, [image, allImages]);

  useEffect(() => {
    return () => {
      if (previousObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(previousObjectUrlRef.current);
        } catch (e) {
          console.error("Fusion error:", e.message);
          throw e; // 👈 IMPORTANT
        }
        previousObjectUrlRef.current = null;
      }
    };
  }, []);

  /** Peek at bytes when server omits image/* Content-Type (proxies, Helmet, etc.) */
  const blobLooksLikeRasterImage = async (blob) => {
    if (!blob || blob.size < 4) return false;
    if (blob.type && blob.type.startsWith("image/")) return true;
    const buf = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    if (
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47
    )
      return true;
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true;
    const riff =
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
    return (
      riff &&
      buf[8] === 0x57 &&
      buf[9] === 0x45 &&
      buf[10] === 0x42 &&
      buf[11] === 0x50
    );
  };

  // Handle file upload and convert to base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      setUserImage(result);

      const base64Data = result.split(",")[1];
      setUserImageBase64(base64Data);
    };

    reader.readAsDataURL(file);
  };

  // Convert an image URL (or data URL) to a data URL string (base64)
  const urlToDataUrl = async (url) => {
    if (!url) return null;
    try {
      if (url.startsWith("data:")) return url;
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn("Unable to fetch/convert source image to data URL:", e);
      return null;
    }
  };

  const generateBlendedImage = async () => {
    if (!userImageBase64) {
      setError("Please upload image");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const defaultPrompt =
        "A photorealistic fashion try-on image. The person from image 2 is wearing the exact outfit from image 1. Preserve face, identity, pose, and background of image 2. Replace only clothing with outfit from image 1. Ensure natural fabric fit, realistic folds, shadows, and lighting consistency.";

      const payload = {
        prompt: userPrompt?.trim() || defaultPrompt,
        imageBase64: userImageBase64,
        referenceImageBase64: null,
      };

      /* 🔥 FIX: ALWAYS CONVERT TO BASE64 */
      if (sourceImage) {
        const absoluteSource =
          sourceImage.startsWith("http") || sourceImage.startsWith("data:")
            ? sourceImage
            : new URL(sourceImage, window.location.origin).href;

        try {
          let dataUrl;

          if (absoluteSource.startsWith("data:")) {
            dataUrl = absoluteSource;
          } else {
            // 🔥 IMPORTANT: convert URL → base64
            dataUrl = await urlToDataUrl(absoluteSource);
          }

          if (!dataUrl) {
            throw new Error("Image conversion failed");
          }

          // extract base64
          payload.referenceImageBase64 = dataUrl.split(",")[1];
        } catch (e) {
          console.error("❌ Base64 conversion failed:", e);
          setError("Failed to process reference image");
          setIsGenerating(false);
          return;
        }
      }

      console.log("✅ FINAL PAYLOAD", {
        hasUserImage: !!payload.imageBase64,
        hasReferenceBase64: !!payload.referenceImageBase64,
      });

      if (!payload.referenceImageBase64) {
        setError("Reference image missing");
        setIsGenerating(false);
        return;
      }

      const res = await axiosInstance.post("/ai/fusion", payload, {
        responseType: "blob",
        timeout: 120000,
      });

      const blob = res.data;

      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError("Fusion failed. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadWithWatermark = async () => {
    if (!resultImage) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Download failed: canvas not ready.");
      return;
    }

    const src = resultImage;
    const img = new Image();
    if (!src.startsWith("blob:") && !src.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }

    try {
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error("Could not load result image for export."));
        img.src = src;
      });
    } catch (e) {
      setError(e.message || "Download failed.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Download failed: graphics context unavailable.");
      return;
    }

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) {
      setError("Download failed: invalid image size.");
      return;
    }

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0);

    const fontSize = Math.max(12, Math.floor(canvas.width / 35));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "center";

    const text = logo.name.toUpperCase();
    const spacing = fontSize * 6;

    for (let x = 0; x < canvas.width + spacing; x += spacing) {
      for (let y = 0; y < canvas.height + spacing; y += spacing) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        setError(
          "Export blocked (canvas may be tainted). Try saving the preview via browser tools.",
        );
        return;
      }
      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      link.download = `${logo.name}-${Date.now()}.png`;
      link.href = objectUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
    }, "image/png");
  };

  const handelCurrentImage = (index) => {
    const val = allImages?.[index];
    if (!val) return;
    const absolute =
      val.startsWith("http") || val.startsWith("data:")
        ? val
        : new URL(val, window.location.origin).href;
    setCurrentImage(index);
    setSourceImage(absolute);
  };
  return (
    <div className="h-full min-h-0 w-full bg-slate-50 rounded-2xl flex items-stretch justify-center p-2 sm:p-3">
      <div className="w-full max-w-[900px] h-full min-h-0 max-h-full bg-white rounded-[1.75rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-300/40 overflow-hidden flex flex-col border border-slate-100">
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-8 md:p-10">
          <header className="flex items-center justify-between mb-10 animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
                <Wand2 className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {logo.name}
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-600 font-bold">
                  AI Design Engine
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-[10px] font-bold border border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              MODEL: GEMINI-2.5-FLASH
            </div>
          </header>
          <section className="w-full px-2 sm:px-4 mb-4">
            <div className="flex gap-3 items-center justify-center sm:gap-4 overflow-x-auto no-scrollbar bg-black/5 rounded-2xl p-3 sm:p-4">
              {allImages?.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  onClick={() => handelCurrentImage(index)}
                  alt={`thumbnail-${index + 1}`}
                  loading="eager"
                  className={`h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 min-w-[56px] sm:min-w-[64px] object-cover rounded-lg cursor-pointer transition-all duration-300 
        ${
          currentImage === index
            ? "border-2 border-teal-500 scale-105 shadow-md"
            : "border border-transparent opacity-70 hover:opacity-100 hover:scale-105"
        }`}
                />
              ))}
            </div>
          </section>

          <main className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
            {/* Input Side */}
            <section className="space-y-8 animate-in fade-in slide-in-from-left duration-300 delay-75">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                    Try Now
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    1 of 2
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                  <div className="relative group w-full min-w-0 min-h-[12rem] sm:min-h-[14rem] md:min-h-[16rem] rounded-2xl overflow-hidden border-2 border-slate-50 aspect-square shadow-sm transition-all hover:scale-[1.01]">
                    <img
                      src={sourceImage || undefined}
                      alt={"Style"}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain sm:object-cover bg-slate-100"
                    />
                    <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[8px] text-white font-bold uppercase">
                      Base Style
                    </div>
                  </div>

                  <label className="relative w-full min-w-0 min-h-[12rem] sm:min-h-[14rem] md:min-h-[16rem] rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 aspect-square flex flex-col items-center justify-center cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50/30 group">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="User"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-contain sm:object-cover animate-in fade-in duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          Add Photo
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Prompt
                  </span>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Describe how you want the fusion to look (optional)."
                    className="mt-2 w-full p-3 rounded-xl border border-slate-100 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </label>
                <button
                  onClick={generateBlendedImage}
                  disabled={isGenerating || !userImage}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                    isGenerating || !userImage
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-slate-900 text-white shadow-2xl shadow-slate-300 hover:bg-indigo-600 hover:shadow-indigo-200"
                  }`}
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  {isGenerating ? "Synthesizing..." : "Run AI Fusion"}
                </button>

                {error && (
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-bold border border-rose-100 text-center uppercase tracking-wider">
                    {error}
                  </div>
                )}
              </div>
            </section>

            {/* Output Side */}
            <section className="animate-in fade-in slide-in-from-right duration-300 delay-150">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                  Output
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">
                  2 of 2
                </span>
              </div>

              <div className="relative mx-auto w-full max-w-md md:max-w-none rounded-[2rem] overflow-hidden bg-slate-50 shadow-inner border border-slate-100 flex items-center justify-center group aspect-[4/5] min-h-[min(52vh,420px)] sm:min-h-[min(56vh,480px)] max-h-[min(70vh,560px)]">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div className="absolute w-6 h-6 bg-indigo-600 rounded-full animate-pulse blur-sm"></div>
                    </div>
                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]">
                      Processing
                    </p>
                  </div>
                ) : resultImage ? (
                  <>
                    <img
                      src={resultImage}
                      alt="AI Result"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain sm:object-cover animate-in zoom-in-95 duration-300 bg-slate-100"
                    />
                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4 backdrop-blur-sm pointer-events-none">
                      <p className="text-white text-xs font-black uppercase tracking-widest">
                        Masterpiece Ready
                      </p>
                      <button
                        onClick={downloadWithWatermark}
                        className="bg-white text-indigo-600 p-4 rounded-full hover:scale-110 transition-transform shadow-2xl pointer-events-auto"
                        aria-label="Download AI Result"
                      >
                        <Download className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-200">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      Preview Deck
                    </p>
                  </div>
                )}
              </div>

              {resultImage && !isGenerating && (
                <button
                  onClick={downloadWithWatermark}
                  className="w-full mt-6 py-4 bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
              )}
            </section>
          </main>
        </div>

        <footer className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-4">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-green-600/60"
              />
            ))}
          </div>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">
            {logo.name} Creative Lab
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-green-600/60"
              />
            ))}
          </div>
        </footer>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
      `,
        }}
      />
    </div>
  );
};

export default TryNow;
