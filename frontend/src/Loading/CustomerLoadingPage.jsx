import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Sparkles, Box, ShieldCheck, Zap } from 'lucide-react';

const CustomerLoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = [
    "Fetching the latest styles...",
    "Checking our inventory...",
    "Securing your connection...",
    "Preparing your personalized collection...",
    "Almost there..."
  ];

  // Smooth time-based progress
  useEffect(() => {
    const duration = 5000; // total time in ms
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) clearInterval(progressTimer);
    }, 50); // updates every 50ms

    return () => clearInterval(progressTimer);
  }, []);

  // Rotate messages
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(messageTimer);
  }, []);

  // Sparkles for background
  const sparkles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 2}px`,
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 2}s`,
    }));
  }, []);

  const customStyles = `
    @keyframes pulse-custom {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <style>{customStyles}</style>

      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50/50 rounded-full blur-[120px] -ml-48 -mb-48" />
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-indigo-200 animate-pulse"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
        {/* Animated Brand Icon */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full scale-150 animate-pulse" />
          <div 
            className="relative w-32 h-32 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 border border-slate-50 flex items-center justify-center"
            style={{ animation: 'float-slow 4s infinite ease-in-out' }}
          >
            <ShoppingBag size={56} className="text-indigo-600 stroke-[1.5]" />
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg animate-bounce shadow-rose-200">
              <Sparkles size={18} />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Ram<span className="text-indigo-600">Mart</span>
        </h1>

        {/* Loading Message */}
        <div className="h-6 mb-10 overflow-hidden">
          <p 
            key={messageIndex}
            className="text-slate-500 text-sm font-medium animate-[fade-in-up_0.5s_ease-out]"
          >
            {loadingMessages[messageIndex]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-4">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 w-full h-full animate-[shimmer_2s_infinite]">
                <div className="w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Processing</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex items-center gap-8 opacity-40">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={20} className="text-slate-600" />
            <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Box size={20} className="text-slate-600" />
            <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">Quality</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={20} className="text-slate-600" />
            <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">Fast</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerLoadingPage;