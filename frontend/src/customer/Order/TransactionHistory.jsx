import React, { useState, useEffect } from "react";

/** html2canvas cannot parse oklch()/lab() from modern CSS (e.g. Tailwind v4). */
const UNSUPPORTED_COLOR_FN =
  /oklch|lab\(|lch\(|color\(display|color\(srgb|device-cmyk/i;

function safeCssColor(value, fallback) {
  if (!value || value === "transparent" || value === "rgba(0, 0, 0, 0)")
    return fallback;
  const strValue = String(value);
  if (UNSUPPORTED_COLOR_FN.test(strValue)) {
    // If it's a Tailwind v4 oklch variable or function, return fallback
    return fallback;
  }
  return value;
}

/**
 * Sync clone #receipt-pdf from live DOM computed styles and strip classes/styles
 * so html2canvas does not re-parse Tailwind rules containing oklch.
 */
function cloneReceiptStylesForHtml2Canvas(
  clonedDoc,
  originalId = "receipt-pdf",
) {
  const origRoot = document.getElementById(originalId);
  const cloneRoot = clonedDoc.getElementById(originalId);
  if (!origRoot || !cloneRoot) return;

  const numericProps = [
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "fontSize",
    "lineHeight",
    "letterSpacing",
    "opacity",
    "gap",
  ];

  const stringProps = [
    "display",
    "flexDirection",
    "alignItems",
    "justifyContent",
    "textAlign",
    "fontWeight",
    "fontFamily",
    "textTransform",
    "width",
    "maxWidth",
    "minWidth",
    "minHeight",
    "height",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderTopStyle",
    "borderRightStyle",
    "borderBottomStyle",
    "borderLeftStyle",
    "position",
    "top",
    "left",
    "right",
    "zIndex",
    "gridTemplateColumns",
    "whiteSpace",
    "overflow",
    "verticalAlign",
  ];

  function walk(orig, clone) {
    clone.removeAttribute("class");
    clone.removeAttribute("style");
    const cs = window.getComputedStyle(orig);

    numericProps.forEach((p) => {
      const v = cs[p];
      if (v) clone.style[p] = v;
    });
    stringProps.forEach((p) => {
      const v = cs[p];
      if (v && v !== "none" && v !== "normal") clone.style[p] = v;
    });

    clone.style.color = safeCssColor(cs.color, "#0f172a");
    clone.style.backgroundColor = safeCssColor(cs.backgroundColor, "#ffffff");
    ["Top", "Right", "Bottom", "Left"].forEach((side) => {
      const key = `border${side}Color`;
      clone.style[key] = safeCssColor(cs[key], "#e2e8f0");
    });

    const oc = Array.from(orig.children);
    const cc = Array.from(clone.children);
    for (let i = 0; i < oc.length; i++) {
      if (cc[i]) walk(oc[i], cc[i]);
    }

    // Force reset any background images or gradients that might contain oklch
    clone.style.backgroundImage = "none";
    clone.style.borderImage = "none";
  }

  walk(origRoot, cloneRoot);
}

import QRCode from "qrcode";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchTransactionByUser } from "../../Redux Toolkit/Features/Seller/transactionSlice";
import secureLocalStorage from "react-secure-storage";
import { logo } from "../json/common";
import {
  ArrowUpRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  FileText,
  Loader2,
  Mail,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import TransactionStatement from "./TransactionStatement";
import { generateInvoicePDF } from "./pdf/generateInvoicePDF";
const TransactionHistory = () => {
  const dispatch = useAppDispatch();
  const { transaction: transactions, loading } = useAppSelector(
    (s) => s.transaction,
  );

  const [getTransactions, setGetTransactions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("details"); // 'details' or 'pdf'
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const token = secureLocalStorage.getItem("token");
  const transactionData = selectedTx;

  useEffect(() => {
    dispatch(fetchTransactionByUser({ token }));
  }, [token, dispatch]);

  // Load external libraries for PDF and Screenshot generation
  useEffect(() => {
    const scripts = [
      {
        id: "h2c-script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      },
      {
        id: "h2p-script",
        src: "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
      },
    ];

    scripts.forEach((s) => {
      if (!document.getElementById(s.id)) {
        const script = document.createElement("script");
        script.id = s.id;
        script.src = s.src;
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }, []);

  const openModal = (tx) => {
    setSelectedTx(tx);
    setViewMode("details");
    setIsModalOpen(true);
  };

  const handleShare = async () => {
    if (!transactionData || !window.html2canvas || isProcessing) return;

    setIsProcessing(true);
    const prevMode = viewMode;

    try {
      setViewMode("pdf");
      await new Promise((r) => requestAnimationFrame(r));

      const element = document.getElementById("receipt-pdf");
      if (!element) throw new Error("Receipt element not found");

      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        onclone: (doc) => {
          doc.querySelectorAll("*").forEach((el) => {
            const style = window.getComputedStyle(el);

            ["color", "backgroundColor", "borderColor"].forEach((prop) => {
              const value = style[prop];

              if (value?.includes("oklch")) {
                el.style[prop] = convertOklchToRgb(value);
              }
            });
          });
        },
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) throw new Error("Failed to generate image");

      const file = new File([blob], "Receipt.png", { type: "image/png" });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${logo.name} Receipt`,
          text: `Hey start your fashion with latest thing @${logo.name}`,
          files: [file],
        });
      } else {
        fallbackShare(canvas);
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    } finally {
      setViewMode(prevMode);
      setIsProcessing(false);
    }
  };

  // gray to color full
  const convertOklchToRgb = (oklch) => {
    try {
      const match = oklch.match(/oklch\(([^)]+)\)/);
      if (!match) return "#000";

      const parts = match[1].trim().split(/\s+/);

      let l = parseFloat(parts[0]);
      let c = parseFloat(parts[1]);
      let h = parseFloat(parts[2]);

      // Handle % lightness
      if (parts[0].includes("%")) {
        l = l / 100;
      }

      // Convert OKLCH → OKLAB
      const a = c * Math.cos((h * Math.PI) / 180);
      const b = c * Math.sin((h * Math.PI) / 180);

      // OKLAB → Linear RGB (approx)
      const r = l + 0.3963377774 * a + 0.2158037573 * b;
      const g = l - 0.1055613458 * a - 0.0638541728 * b;
      const bVal = l - 0.0894841775 * a - 1.291485548 * b;

      const to255 = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));

      return `rgb(${to255(r)}, ${to255(g)}, ${to255(bVal)})`;
    } catch (e) {
      return "#000";
    }
  };

  const handleDownloadPdf = () => {
    if (!transactionData) return;
    generateInvoicePDF(transactionData);
  };

  const InfoBlock = ({ label, value, icon: Icon }) => (
    <div className="flex flex-col p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-500">
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-slate-800 font-bold break-all">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div
        data-html2canvas-ignore="true"
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-2xl mx-auto">
          <header className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center px-3 py-2 gap-2  rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} />
              Recent Activities
            </div>
            <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Transactions
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Keep track of your latest fashion hauls.
            </p>
            <button
              onClick={() => setGetTransactions(true)}
              className="right-5 px-5 py-3 bg-green-400 rounded-2xl cursor-pointer absolute top-20 hover:text-white hover:bg-green-500 transition-all duration-500 font-bold text-sm flex items-center gap-2 active:scale-95"
            >
              <CalendarDays size={18} className="inline-block mr-2" />
              Get Statement
            </button>
          </header>

          {getTransactions && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              {/* Modal Box */}
              <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 relative">
                {/* Close Button */}
                <button
                  onClick={() => setGetTransactions(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X size={20} />
                </button>

                {/* Statement Component */}
                <TransactionStatement
                  transactions={transactions}
                  user={transactions?.[0]?.customer}
                />
              </div>
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 space-y-4">
            {loading && (
              <div className="flex justify-center py-16 text-slate-500 font-bold">
                <Loader2 className="animate-spin mr-2" size={22} />
                Loading transactions…
              </div>
            )}
            {!loading && (!transactions || transactions.length === 0) && (
              <div className="w-full bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white text-center text-slate-500 font-medium">
                No transactions yet. Complete a payment to see it here.
              </div>
            )}
            {!loading &&
              Array.isArray(transactions) &&
              transactions.map((tx) => (
                <button
                  key={tx._id}
                  type="button"
                  onClick={() => openModal(tx)}
                  className="w-full bg-white/10 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col md:flex-row md:items-center gap-6 hover:scale-[1.02] active:scale-[0.98] transition-all group text-left"
                >
                  <div className="flex items-center gap-6 flex-1 p-2">
                    <div className="w-15 h-15 rounded-3xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-all duration-500 shadow-2xl group-hover:rotate-6">
                      <CreditCard size={32} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-3xl font-black text-slate-900">
                          ₹{Number(tx.amount || 0).toLocaleString()}
                        </h3>
                        <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {tx.paymentStatus || "SUCCESS"}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <span>
                          {tx.date
                            ? new Date(tx.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="truncate">
                          {tx.customer?.name || "Customer"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4 px-2 md:px-0">
                    <span className="text-sm font-black text-indigo-600 md:hidden">
                      Details
                    </span>
                    <div className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all duration-500">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {isModalOpen && transactionData && (
            <div className="fixed inset-0 z-[9999] top-15 flex items-center justify-center p-0 md:p-6 overflow-hidden">
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
                onClick={() => {
                  if (!isProcessing) {
                    setIsModalOpen(false);
                    setSelectedTx(null);
                  }
                }}
                data-html2canvas-ignore="true"
              ></div>

              <div className="relative bg-white w-full max-w-2xl md:rounded-[3rem] shadow-2xl overflow-hidden h-full md:h-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <div
                  className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md"
                  data-html2canvas-ignore="true"
                >
                  <div className="bg-slate-100 p-1.5 rounded-2xl flex w-full max-w-[240px]">
                    <button
                      onClick={() => !isProcessing && setViewMode("details")}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewMode === "details" ? "bg-white shadow-lg text-indigo-600" : "text-slate-500"}`}
                    >
                      <Eye size={14} /> Details
                    </button>
                    <button
                      onClick={() => !isProcessing && setViewMode("pdf")}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewMode === "pdf" ? "bg-white shadow-lg text-indigo-600" : "text-slate-500"}`}
                    >
                      <FileText size={14} /> Receipt
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (!isProcessing) {
                        setIsModalOpen(false);
                        setSelectedTx(null);
                      }
                    }}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {viewMode === "details" ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="relative bg-indigo-600 p-5 text-white overflow-hidden">
                        {/* CURVE LAYER */}
                        <div className="absolute inset-0">
                          <svg
                            className="absolute bottom-0 left-0 w-full h-24"
                            viewBox="0 0 1440 320"
                            preserveAspectRatio="none"
                          >
                            <path
                              fill="white"
                              fillOpacity="0.12"
                              d="M0,256L80,234.7C160,213,320,171,480,165.3C640,160,800,192,960,197.3C1120,203,1280,181,1360,170.7L1440,160L1440,320L0,320Z"
                            />
                          </svg>
                        </div>

                        {/* CONTENT */}
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-white/20 rounded-[2rem] border border-white/20 backdrop-blur-xl">
                              <ShieldCheck size={32} />
                            </div>

                            <div>
                              <h2 className="text-xl font-black tracking-tight">
                                Confirmed Payment
                              </h2>
                              <p className="text-indigo-200 text-sm font-bold uppercase tracking-[0.2em] mt-1">
                                Order Transaction Success
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                              <p className="text-indigo-300 text-[10px] uppercase font-black tracking-widest">
                                Amount Charged
                              </p>
                              <p className="text-2xl font-black">
                                ₹
                                {Number(
                                  transactionData.amount || 0,
                                ).toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-white/10 px-3 py-2 rounded-3xl border border-white/20 backdrop-blur-xl">
                              <p className="text-[10px] uppercase tracking-widest font-black opacity-60">
                                Payment via
                              </p>
                              <p className="flex items-center gap-2 text-xl font-black capitalize">
                                <CreditCard
                                  size={20}
                                  className="text-indigo-300"
                                />
                                {transactionData.paymentMethod || "razorpay"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 md:p-12 space-y-12">
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <User size={20} />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">
                              Customer Details
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoBlock
                              label="Full Name"
                              value={transactionData.customer?.name || "—"}
                              icon={User}
                            />
                            <InfoBlock
                              label="Email Address"
                              value={transactionData.customer?.email || "—"}
                              icon={Mail}
                            />
                            <InfoBlock
                              label="Contact Number"
                              value={`+91 ${transactionData.customer?.mobile ?? "—"}`}
                              icon={Phone}
                            />
                            <InfoBlock
                              label="Payment ID"
                              value={transactionData.paymentId || "—"}
                              icon={ShieldCheck}
                            />
                          </div>
                        </section>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 p-6 md:p-12 flex justify-center animate-in fade-in slide-in-from-left-4 duration-500">
                      <div
                        id="receipt-pdf"
                        className="bg-white w-full max-w-[210mm] shadow-2xl p-10 md:p-16 relative overflow-hidden flex flex-col border border-slate-200 min-h-[600px]"
                      >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                          <span className="opacity-5 text-6xl md:text-8xl font-black whitespace-nowrap transform rotate-[-30deg]">
                            {logo.name}
                          </span>
                        </div>

                        <div className="relative z-10">
                          <div className="flex justify-between items-start border-b-8 border-slate-900 pb-10 mb-12">
                            <div>
                              <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
                                {logo.name}
                              </h1>
                              <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mt-3">
                                Digital Fashion Hub
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-slate-900 mb-2">
                                TAX INVOICE
                              </p>
                              <div className="text-slate-400 text-[10px] font-black space-y-1 uppercase tracking-widest">
                                <p>TXN ID: {transactionData.paymentId}</p>
                                <p>
                                  Date:{" "}
                                  {transactionData?.date
                                    ? new Date(
                                        transactionData.date,
                                      ).toLocaleDateString()
                                    : "—"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-20 mb-16">
                            <div>
                              <p className="text-[10px] font-black text-indigo-600 mb-4 tracking-[0.2em] uppercase underline underline-offset-4 decoration-2">
                                Customer Info
                              </p>
                              <p className="font-black text-slate-900 text-xl mb-1">
                                {transactionData?.customer?.name}
                              </p>
                              <p className="text-slate-500 text-sm font-medium">
                                {transactionData?.customer?.email}
                              </p>
                              <p className="text-slate-500 text-sm font-medium">
                                +91 {transactionData?.customer?.mobile}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-indigo-600 mb-4 tracking-[0.2em] uppercase underline underline-offset-4 decoration-2">
                                Merchant
                              </p>
                              <p className="font-black text-slate-900 text-xl mb-1">
                                {logo.name} Fashions
                              </p>
                              <p className="text-slate-500 text-sm font-medium">
                                Electronics City Phase 1
                              </p>
                              <p className="text-slate-500 text-sm font-medium">
                                Bangalore, KA, 560100
                              </p>
                            </div>
                          </div>

                          <div className="mb-20">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b-4 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest">
                                  <th className="py-4 text-left">
                                    Description
                                  </th>
                                  <th className="py-4 text-right">Qty</th>
                                  <th className="py-4 text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody className="text-slate-700 font-bold">
                                {(
                                  transactionData.order?.orderItems ||
                                  transactionData.orderItems ||
                                  []
                                ).length > 0 ? (
                                  (
                                    transactionData.order?.orderItems ||
                                    transactionData.orderItems
                                  ).map((line) => {
                                    const populated =
                                      line &&
                                      typeof line === "object" &&
                                      line.product;
                                    const title = populated
                                      ? line.product.title
                                      : "Order item";
                                    const qty = populated ? line.quantity : 1;
                                    const lineTotal = populated
                                      ? (line.sellingPrice || 0) *
                                        (line.quantity || 1)
                                      : (transactionData.order
                                          ?.totalSellingPrice ??
                                        transactionData.amount);
                                    return (
                                      <tr
                                        key={line._id || String(line)}
                                        className="border-b-2 border-slate-100"
                                      >
                                        <td className="py-8">
                                          <p className="text-lg font-black text-slate-900">
                                            {title}
                                          </p>
                                          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-black">
                                            Ref: {transactionData.order?._id}
                                          </p>
                                        </td>
                                        <td className="py-8 text-right">
                                          {qty}
                                        </td>
                                        <td className="py-8 text-right font-black text-slate-900 text-lg">
                                          ₹{lineTotal}
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr className="border-b-2 border-slate-100">
                                    <td className="py-8">
                                      <p className="text-lg font-black text-slate-900">
                                        Order
                                      </p>
                                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-black">
                                        Ref: {transactionData.order?._id}
                                      </p>
                                    </td>
                                    <td className="py-8 text-right">—</td>
                                    <td className="py-8 text-right font-black text-slate-900 text-lg">
                                      ₹{transactionData.amount}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-auto">
                            <div className="flex justify-end border-t-8 border-slate-900 pt-10">
                              <div className="w-full max-w-[300px] space-y-4">
                                <div className="flex justify-between text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <span>Gross Total</span>
                                  <span className="text-slate-900">
                                    ₹{transactionData.amount}
                                  </span>
                                </div>
                                <div className="flex justify-between text-3xl font-black text-slate-900 pt-6 border-t border-slate-100">
                                  <span>TOTAL</span>
                                  <span>₹{transactionData.amount}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-24 text-center border-t border-dashed border-slate-200 pt-12">
                              <p className="text-indigo-600 font-black text-2xl tracking-tighter italic mb-4">
                                "Hey start your fashion with letast thing @
                                {logo.name}"
                              </p>
                              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                Computer Generated Receipt • No Signature
                                Required
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="p-8 border-t border-slate-100 bg-white grid grid-cols-2 gap-4 sticky bottom-0 z-20"
                  data-html2canvas-ignore="true"
                >
                  <button
                    onClick={handleShare}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-slate-200"
                  >
                    {isProcessing ? (
                      <Loader2
                        size={18}
                        className="animate-spin text-indigo-400"
                      />
                    ) : (
                      <Share2 size={18} />
                    )}
                    Share Receipt
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50 active:scale-95"
                  >
                    {isProcessing ? (
                      <Loader2 size={18} className="animate-spin text-white" />
                    ) : (
                      <Download size={18} />
                    )}
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
