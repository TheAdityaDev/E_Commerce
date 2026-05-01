import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Gift,
  Star,
  CheckCircle,
  X,
  ArrowRight,
  Sparkles,
  Clock,
  Info,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Tag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import Lottie from "lottie-react";
import no_product from "../../assets/animations/no_product.json";
import { fetchAllCoupon } from "../../Redux Toolkit/Features/Admin/couponSlice";
import secureLocalStorage from "react-secure-storage";

/**
 * Reusable Brand Logo Component
 */
const BrandLogo = ({ initials, colors, className = "w-10 h-10" }) => (
  <div
    className={`${className} relative flex items-center justify-center bg-gradient-to-br ${colors} rounded-xl shadow-inner overflow-hidden`}
  >
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)] animate-pulse" />
    <span className="text-white font-black text-sm italic tracking-tighter select-none">
      {initials}
    </span>
  </div>
);

/**
 * Individual Reward Card Component
 */
const RewardCard = ({ reward, onClaim }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = reward.expiryTime - Date.now();
      if (difference <= 0) {
        setIsExpired(true);
        clearInterval(timer);
      } else {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [reward.expiryTime]);

  if (isExpired && !reward.isClaimed) return null;

  return (
    <div
      className={`relative bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${reward.isClaimed ? "ring-2 ring-emerald-500" : ""}`}
    >
      <div
        className={`h-24 flex items-center justify-center relative transition-colors duration-500 ${reward.isClaimed ? "bg-emerald-500" : `bg-gradient-to-r ${reward.theme}`}`}
      >
        <div
          className={`p-1 bg-white rounded-xl shadow-lg transform transition-transform duration-700 ${reward.isClaimed ? "rotate-[360deg]" : ""}`}
        >
          <BrandLogo
            initials={reward.initials}
            colors={reward.theme}
            className="w-12 h-12"
          />
        </div>
        {reward.isClaimed && (
          <div className="absolute top-2 right-2 bg-white/20 p-1 rounded-full text-white">
            <CheckCircle size={16} />
          </div>
        )}
      </div>

      <div className="p-5 text-center">
        {!reward.isClaimed && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black mb-3 tracking-wider">
            <Clock size={10} />
            <span>
              {timeLeft.d}D {timeLeft.h}H {timeLeft.m}M
            </span>
          </div>
        )}

        <div className="mb-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {reward.brand}
          </span>
          <h3 className="text-lg font-black text-slate-800 leading-tight">
            {reward.title}
          </h3>
        </div>

        <div
          className={`mb-5 p-3 rounded-xl border-2 border-dashed transition-all ${reward.isClaimed ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}
        >
          <div className="flex flex-col items-center">
            <span
              className={`text-2xl font-black ${reward.isClaimed ? "text-emerald-600" : "text-slate-800"}`}
            >
              {reward.value}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
              {reward.subtitle}
            </span>
          </div>
        </div>

        <button
          onClick={() => onClaim(reward)}
          className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 group text-sm ${
            reward.isClaimed
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-slate-900 text-white hover:bg-black shadow-md"
          }`}
        >
          {reward.isClaimed ? "View Code" : "Redeem Offer"}
          {!reward.isClaimed && (
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          )}
        </button>
      </div>
    </div>
  );
};

const Rewards = () => {
  // Accessing the correct state path based on your Redux structure
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAllCoupon({ token: secureLocalStorage.getItem("token") }));
  }, []);

  const { coupons, loading } = useAppSelector((store) => store?.adminCoupon);


  const couponData = Array.isArray(coupons) ? coupons[0] : coupons?.coupon;
  const [activeReward, setActiveReward] = useState(null);
  const [claimedCodes, setClaimedCodes] = useState({});
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Map Redux data to card design format
  const rewards = useMemo(() => {
    if (!coupons || (Array.isArray(coupons) && coupons.length === 0)) return [];

    const themes = [
      "from-indigo-600 to-purple-600",
      "from-blue-600 to-indigo-700",
      "from-emerald-600 to-teal-700",
      "from-orange-500 to-red-600",
      "from-pink-500 to-rose-700",
      "from-violet-500 to-purple-800",
      "from-amber-400 to-orange-600",
      "from-cyan-500 to-blue-600",
      "from-lime-500 to-green-700",
      "from-fuchsia-500 to-purple-700",
    ];

    const brands = [
      "Aura",
      "Elite",
      "Luxe",
      "Nova",
      "Urban",
      "Pure",
      "Glow",
      "Swift",
      "Nomad",
      "Zen",
    ];

    const dataArray = Array.isArray(coupons) ? coupons : [coupons];
    return dataArray.map((coupon, i) => ({
      id: coupon._id || i + 1,
      brand: brands[i % brands.length] + " Premium",
      initials: brands[i % brands.length].substring(0, 2).toUpperCase(),
      title: "Exclusive Savings",
      value: `${coupon.discountPercentage ?? 0}% OFF`,
      subtitle: `Min. Order ₹${coupon.minimumOrderValue ?? 0}`,
      code: String(coupon.code || ""),
      theme: themes[i % themes.length],
      expiryTime: coupon.validityExpireDate
        ? new Date(coupon.validityExpireDate).getTime()
        : Date.now(),
      isClaimed: !!claimedCodes[coupon._id || i + 1],
      isRevealed: !!claimedCodes[coupon._id || i + 1],
    }));
  }, [coupons, claimedCodes]);

  const handleOpenPopup = (reward) => {
    setActiveReward(reward);
  };

  const handleCopyCode = (id, code) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setClaimedCodes((prev) => ({ ...prev, [id]: true }));

    if (activeReward && activeReward.id === id) {
      setActiveReward((prev) => ({
        ...prev,
        isRevealed: true,
        isClaimed: true,
      }));
    }

    setCopied(true);
    setShowConfetti(true);
    setTimeout(() => {
      setCopied(false);
      setShowConfetti(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin mb-4 inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-500 font-medium">Fetching rewards...</p>
        </div>
      </div>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Lottie animationData={no_product} loop={true} className="h-64 w-64" />
        <h2 className="text-2xl font-bold text-slate-800 mt-4">
          No Rewards Available
        </h2>
        <p className="text-slate-500">Check back later for exclusive offers!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold">
              <Zap size={20} />
              <span className="uppercase tracking-[0.2em] text-xs">
                Live Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900">
              Your Active Coupons
            </h1>
            <p className="text-slate-500 mt-2">
              {rewards.length} Exclusive offers available for you
              {/* Valid until{" "}
              {couponData?.validityExpireDate
                ? new Date(couponData?.validityExpireDate).toLocaleDateString(
                    undefined,
                    { day: "numeric", month: "long", year: "numeric" },
                  ) : "N/A"} */}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
              <Tag size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">
                Status
              </div>
              <div className="text-xl font-black text-slate-800">
                {rewards.length > 0 ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <RewardCard
              key={reward._id || reward.id}
              reward={reward}
              onClaim={handleOpenPopup}
            />
          ))}
        </div>

        {activeReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden transform animate-in zoom-in slide-in-from-bottom-8 duration-500">
              <div className="p-8 text-center bg-slate-50/50 border-b border-slate-100 relative">
                <button
                  onClick={() => setActiveReward(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
                <BrandLogo
                  initials={activeReward.initials}
                  colors={activeReward.theme}
                  className="w-20 h-20 mx-auto mb-4 shadow-xl"
                />
                <h3 className="text-2xl font-black text-slate-800">
                  {activeReward.brand}
                </h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="relative">
                  <div className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest text-center">
                    Your Redemption Code
                  </div>
                  <div
                    className={`p-5 rounded-2xl border-2 text-center transition-all duration-700 font-mono text-xl font-bold tracking-widest ${activeReward.isRevealed ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-100 border-slate-200 text-slate-300 blur-md select-none"}`}
                  >
                    {activeReward.isRevealed ? activeReward.code : "URSWQB0FVO"}
                  </div>
                  {!activeReward.isRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center pt-8">
                      <span className="text-[10px] font-black text-white bg-indigo-600 px-4 py-2 rounded-full shadow-lg animate-bounce uppercase">
                        Click Copy to Reveal
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-400 uppercase">
                      Discount
                    </span>
                    <span className="font-bold text-slate-800">
                      {activeReward.value}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400 uppercase">
                      Min. Spend
                    </span>
                    <span className="font-bold text-slate-800">
                      {activeReward.subtitle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleCopyCode(activeReward.id, activeReward.code)
                  }
                  className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${copied ? "bg-emerald-500 text-white scale-105" : "bg-slate-900 text-white hover:bg-black active:scale-95"}`}
                >
                  {copied ? (
                    <>
                      <Check size={24} /> COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />{" "}
                      {activeReward.isRevealed ? "COPY AGAIN" : "REVEAL & COPY"}
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 bg-white text-center border-t border-slate-50">
                <button
                  onClick={() => setActiveReward(null)}
                  className="text-indigo-600 text-sm font-bold hover:underline uppercase tracking-widest"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[100]">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  color: ["#6366f1", "#10b981", "#f59e0b"][i % 3],
                }}
              >
                <Star size={Math.random() * 20 + 10} fill="currentColor" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
