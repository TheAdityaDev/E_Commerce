import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  QrCode,
  User,
  Flashlight,
  FlashlightOff,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const BottomBar = () => {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  const navigate = useNavigate();

  const handelAccount = () => {
    const token = secureLocalStorage.getItem("token")?.trim();
    if (!token) navigate("/auth/login");
    else navigate("/account");
  };

  const qrRef = useRef(null);

  // Load html5-qrcode script dynamically
  useEffect(() => {
    if (window.Html5Qrcode) {
      setIsLibraryLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode";
    script.async = true;
    script.onload = () => setIsLibraryLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Hide bottom bar on scroll
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      setVisible(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(true), 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrRef.current) {
        qrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Wait for DOM element
  const waitForElement = async (id) => {
    let retries = 20;
    while (!document.getElementById(id) && retries > 0) {
      await new Promise((r) => setTimeout(r, 100));
      retries--;
    }
    if (!document.getElementById(id)) throw new Error("QR container not found");
  };

  // Start QR Scanner
  const startScanner = async () => {
    if (!isLibraryLoaded || !window.Html5Qrcode) {
      setError("Scanner library loading, please try again in a moment...");
      return;
    }

    try {
      setOpen(true);
      await waitForElement("qr-reader");

      const qr = new window.Html5Qrcode("qr-reader");
      qrRef.current = qr;

      await qr.start(
        { facingMode: "environment" },
        {
          fps: 16,
          qrbox: 250,
          aspectRatio: 16 / 9,
          disableFlip: false,
          disableTorch: false,
          background: "#000000",
        },
        (decodedText) => {
          qr.stop().catch(() => {});
          window.open(decodedText, "_blank", "noopener,noreferrer");
          setOpen(false);
        },
        (err) => {
          // ignore minor scan errors
          console.log(err);
        },
      );
    } catch (err) {
      console.error("Scanner error:", err);
      setError("Camera not ready or permission denied");
      setOpen(false);
    }
  };

  // Stop QR Scanner
  const stopScanner = async () => {
    try {
      if (qrRef.current) {
        await qrRef.current.stop();
        qrRef.current.clear();
        qrRef.current = null;
      }
    } catch (err) {
      console.error("Stop error:", err);
    }
    setOpen(false);
    setError(null);
  };

  // Torch toggle
  const toggleTorch = async () => {
    try {
      const track = qrRef.current?.getRunningTrack();
      if (!track) return;

      await track.applyConstraints({
        advanced: [{ torch: !isTorchOn }],
      });

      setIsTorchOn(!isTorchOn);
    } catch {
      setError("Torch not supported");
    }
  };

  return (
    <div className="bg-gray-100 items-center justify-center relative overflow-hidden ">
      {/* Bottom Bar */}
      <section
        className={`fixed z-10 bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-[72px] flex items-center justify-around bg-white/90 backdrop-blur-xl rounded-3xl transition-transform duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 lg:hidden ${
          open ? "translate-y-32" : "translate-y-0"
        }`}
      >
        <NavItem icon={<Search size={24}  />} label="Search" />
        <NavItem icon={<Heart onClick={()=>navigate("/favriout")} size={24} />} label="Wishlist" />

        {/* QR Button */}
        <div className="relative -mt-10">
          <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20"></div>
          <button
            onClick={startScanner}
            className="relative w-[72px] h-[72px] bg-gradient-to-tr from-gray-900 to-black text-white rounded-full flex items-center justify-center shadow-xl shadow-black/30 hover:scale-105 active:scale-95 transition-all"
          >
            <QrCode size={30} className="text-emerald-400" />
          </button>
        </div>

        <NavItem icon={<ShoppingBag size={24} />} label="Cart" />
        <NavItem
          icon={<User size={24} onClick={handelAccount} />}
          label="Profile"
        />
      </section>

      {/* Scanner Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          {/* Html5Qrcode container */}
          <div
            id="qr-reader"
            className="absolute  w-full h-full object-cover bg-black border-none overflow-hidden"
            style={{ border: "none", background: "bg-black" }}
          />

          {/* Overlay & Controls */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {/* Top controls */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto z-50">
              <button
                onClick={toggleTorch}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
              >
                {isTorchOn ? (
                  <Flashlight className="text-emerald-400" />
                ) : (
                  <FlashlightOff />
                )}
              </button>

              <button
                onClick={stopScanner}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Instructions */}
            <div className="absolute top-32 text-center text-white pointer-events-auto z-20 animate-pulse">
              <h2 className="text-xl font-semibold tracking-wide drop-shadow-lg">
                Scan QR Code
              </h2>
              <p className="text-sm text-white/70 mt-1 drop-shadow-md">
                Align code within the frame to scan
              </p>
            </div>

            {/* Scanner Frame & Animation */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-[2rem] shadow-[0_0_0_4000px_rgba(0,0,0,0.65)] overflow-hidden flex items-center justify-center z-10 transition-all">
              {/* Custom corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-emerald-400 rounded-tl-[2rem] "></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-emerald-400 rounded-tr-[2rem] "></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-emerald-400 rounded-bl-[2rem] "></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-emerald-400 rounded-br-[2rem] "></div>

              {/* Laser line */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="laser-beam w-full absolute top-0 left-0">
                  <div className="w-full h-[2px] bg-emerald-400 shadow-[0_0_15px_3px_rgba(52,211,119,0.8)]"></div>
                  <div className="w-full h-24 bg-gradient-to-t from-emerald-400/30 to-transparent -mt-[2px]"></div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="absolute bottom-28 px-6 py-3 bg-red-500/90 backdrop-blur-md text-white rounded-full shadow-lg pointer-events-auto z-20 flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Laser animation & corner removal CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .laser-beam {
              animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            @keyframes scan {
              0% { transform: translateY(-100px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(350px); opacity: 0; }
            }

            /* Remove default white corners & shaded region of Html5Qrcode */
            #qr-shaded-region { display: none !important; }
            #qr-reader * { border: none !important; outline: none !important; box-shadow: none !important; }
            #qr-reader .qr-overlay { display: none !important; }
            #qr-reader canvas { display: none !important; }
            #qr-reader video { object-fit: cover !important; }

            #qr-reader {
              border: none !important; /* Removes the white border */
              background-color: black !important; /* Removes white background */
            }
          `,
        }}
      />
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex flex-col items-center cursor-pointer text-gray-500">
    {icon}
    <span className="text-xs">{label}</span>
  </div>
);

export default BottomBar;
