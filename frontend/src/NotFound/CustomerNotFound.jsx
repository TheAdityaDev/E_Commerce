import React, { useState, useEffect, useMemo } from 'react';
import { Home, RefreshCw, ShoppingBag, Search, ShoppingCart, PackageOpen, ArrowRight } from 'lucide-react';

const CustomerNotFound = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate subtle "sparkle" particles for a premium retail feel
  const particles = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      duration: `${3 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
      opacity: 0.1 + Math.random() * 0.4
    }));
  }, []);

  // Global styles for custom keyframe animations
  const customStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(-2deg); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0; }
      50% { opacity: 0.3; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    @keyframes drift {
      from { transform: translateX(0) translateY(0); }
      to { transform: translateX(10px) translateY(10px); }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.5); }
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-200">
      <style>{customStyles}</style>
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-indigo-400"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animation: `sparkle ${p.duration} infinite ease-in-out`,
              animationDelay: p.delay,
              opacity: p.opacity
            }}
          />
        ))}
      </div>

      {/* Soft color splashes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-100 rounded-full blur-[100px] opacity-60" />

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full">
        
        {/* Main Visual: Floating Shopping Bag */}
        <div 
          className="mb-12 relative"
          style={{ 
            animation: 'float 5s infinite ease-in-out',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1s ease-out'
          }}
        >
          <div className="relative group">
            {/* Animated rings behind the bag */}
            <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] rounded-full scale-150" />
            <div className="absolute inset-0 border-4 border-indigo-500/5 rounded-full scale-110" style={{ animation: 'pulse-ring 3s infinite' }} />
            <div className="absolute inset-0 border border-indigo-500/10 rounded-full scale-125" style={{ animation: 'pulse-ring 3s infinite 1s' }} />
            
            <div className="relative bg-white p-12 md:p-16 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center overflow-hidden">
               <ShoppingBag size={120} className="text-indigo-600 stroke-[1.5]" />
               
               {/* Small floating "discounts/items" icons */}
               <div className="absolute top-6 right-6 p-2 bg-rose-100 rounded-lg text-rose-500 rotate-12 animate-bounce">
                 <ShoppingCart size={20} />
               </div>
               <div className="absolute bottom-10 left-6 p-2 bg-amber-100 rounded-lg text-amber-600 -rotate-12">
                 <Search size={20} />
               </div>
            </div>
          </div>

          {/* Large Stylized 404 Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10">
            <h1 className="text-[14rem] md:text-[20rem] font-black text-slate-200/40 leading-none select-none tracking-tighter">
              404
            </h1>
          </div>
        </div>

        {/* Messaging Section */}
        <div 
          className="space-y-6 max-w-xl"
          style={{ 
            opacity: mounted ? 1 : 0, 
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold tracking-widest uppercase mb-2">
            <PackageOpen size={14} />
            Out of Stock or Moved
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Lost in the <span className="text-indigo-600">Aisles</span>?
          </h2>
          
          <p className="text-slate-500 text-lg leading-relaxed">
            Oops! The product or collection you're looking for has been moved, renamed, or is currently taking a break from our catalog.
          </p>
        </div>

        {/* Action Buttons */}
        <div 
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
          style={{ 
            opacity: mounted ? 1 : 0, 
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
          }}
        >
          <button 
            onClick={() => window.location.href = '/'}
            className="group px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-xl shadow-indigo-200 active:scale-95"
          >
            <Home size={20} />
            Continue Shopping
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => window.location.href = '/orders'}
            className="px-10 py-5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl flex items-center gap-3 border border-slate-200 transition-all duration-300 shadow-sm"
          >
            <RefreshCw size={18} />
            Track My Orders
          </button>
        </div>

        {/* Navigation Categories */}
        <div 
          className="mt-20 pt-10 border-t border-slate-200 w-full flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-semibold text-slate-400"
          style={{ 
            opacity: mounted ? 1 : 0, 
            transition: 'opacity 1s ease-out 0.8s'
          }}
        >
          <a href="/new" className="hover:text-indigo-600 transition-colors uppercase tracking-wider">New Arrivals</a>
          <a href="/sale" className="hover:text-rose-500 transition-colors uppercase tracking-wider text-rose-400">Summer Sale</a>
          <a href="/men" className="hover:text-indigo-600 transition-colors uppercase tracking-wider">Men</a>
          <a href="/women" className="hover:text-indigo-600 transition-colors uppercase tracking-wider">Women</a>
          <a href="/support" className="hover:text-indigo-600 transition-colors uppercase tracking-wider">Help Center</a>
        </div>
      </main>

      {/* Floating Discount Tag Decoration */}
      <div className="hidden lg:block absolute left-20 bottom-20 rotate-[-15deg] opacity-20 pointer-events-none">
         <div className="bg-rose-500 text-white px-8 py-3 rounded-xl font-black text-2xl shadow-lg">
           -50% OFF
         </div>
      </div>
    </div>
  );
};

export default CustomerNotFound;