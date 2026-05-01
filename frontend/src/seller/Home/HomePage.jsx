import React, { useState, useEffect, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Package,
  XCircle,
  Clock,
  ArrowUpRight,
  Download,
  FileText,
  FileJson,
  FileSpreadsheet,
  ChevronDown,
  Info,
  Loader,
  TrendingUpIcon,
  Wallet2,
  IndianRupee,
  PackageX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchSellerReport } from "../../Redux Toolkit/Features/Seller/sellerSlice";
import secureLocalStorage from "react-secure-storage";

// Function to calculate market share and percent increase
function calculateSellerStats({ totalSales, totalOrders, previousTotalSales, totalEarnings }) {
  // 1️⃣ Market share %
  const marketShare = (totalSales / totalOrders) * 100;

  // 2️⃣ Percent increase in seller sales
  let percentIncrease = 0;
  if (previousTotalSales > 0) {
    percentIncrease =
      ((totalSales - previousTotalSales) / previousTotalSales) * 100;
  }

  // 3️⃣ Calculate Tax (Assuming 18% GST on Earnings)
  const calculatedTax = totalEarnings * 0.18;

  return {
    marketShare: marketShare.toFixed(2), // rounded to 2 decimals
    percentIncrease: percentIncrease.toFixed(2),
    calculatedTax: calculatedTax.toFixed(2)
  };
}

const StatCard = ({ title, value, icon: Icon, color, percent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
  >
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-800">{value}</h3>
      <div className="flex items-center mt-2 text-emerald-500 text-xs font-semibold">
        <ArrowUpRight size={14} className="mr-1" />
        <span>{percent || 0}% increase</span>
      </div>
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
      <Icon className={color.replace("bg-", "text-gray-600")} size={24} />
    </div>
  </motion.div>
);

export default function HomePage() {
  const dispatch = useAppDispatch();
  const sellerSlice = useAppSelector((store) => store.seller || {});

  console.log(sellerSlice);

  const [activeLines, setActiveLines] = useState({ orders: true, canceled: true });

  // Sync active lines when report data arrives
  useEffect(() => {
    if (sellerSlice?.report) {
      setActiveLines({
        orders: (sellerSlice.report.totalOrders || 0) >= 0,
        canceled: (sellerSlice.report.canceledOrder || 0) >= 0,
      });
    }
  }, [sellerSlice?.report]);


  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pdfInstruction, setPdfInstruction] = useState(false);

  const token = useMemo(() => {
    return secureLocalStorage.getItem("token");
  }, []);

  console.log(token);


  useEffect(() => {
    // Avoid refetching if report already present to prevent duplicate calls
    if (token && !sellerSlice?.report) {
      dispatch(fetchSellerReport(token));
    }
  }, [dispatch, token, sellerSlice?.report]);

  const toggleLine = (key) => {
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // chart data
  const transformWeeklyData = () => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
    const totalOrdersCount = sellerSlice?.report?.totalOrders || 0;
    const totalCanceledCount = sellerSlice?.report?.canceledOrder || 0;
    
    const baseOrders = totalOrdersCount > 8 ? Math.floor((totalOrdersCount - 8) / 6) : 0;
    const extraOrders = totalOrdersCount > 8 ? (totalOrdersCount - 8) % 6 : 0;
    
    const baseCanceled = Math.floor(totalCanceledCount / 7);
    const extraCanceled = totalCanceledCount % 7;

    const weeklyOrdersReport = daysOfWeek.map((day, index) => ({
      day,
      totalOrders: index === 6 ? (totalOrdersCount < 8 ? totalOrdersCount : 8) : (index === 5 ? baseOrders + extraOrders : baseOrders),
      "Canceled Orders": index === 6 ? baseCanceled + extraCanceled : baseCanceled,
    }));
    return weeklyOrdersReport;
  };

  // Fallback static data transformed to new format
  const dynamicChartData = useMemo(() => {
    return transformWeeklyData();
  }, [sellerSlice?.report]);

  const exportJSON = () => {
    const dataStr = JSON.stringify(
      { summary: sellerSlice, history: chartData },
      null,
      2,
    );
    downloadFile(dataStr, "seller-report.json", "application/json");
    setShowExportMenu(false);
  };

  const exportCSV = () => {
    const headers = ["Day", "Orders", "Canceled"];
    const rows = dynamicChartData.map(
      (d) => `${d.day},${d["totalOrders"]},${d["Canceled Orders"]}`,
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    downloadFile(csvContent, "seller-report.csv", "text/csv");
    setShowExportMenu(false);
  };

  const exportDOC = () => {
    const content = `SELLER REPORT\nSeller ID: ${sellerSlice.seller}\nNet Earnings: $${sellerSlice.netEarnings}`;
    downloadFile(content, "seller-report.doc", "application/msword");
    setShowExportMenu(false);
  };

  const exportPDF = () => {
    setPdfInstruction(true);
    setShowExportMenu(false);

    // Slight delay to allow the instruction modal to render before blocking the thread with print()
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.error("Print blocked by browser environment", e);
      }
    }, 500);

    // Auto-hide instruction after a while
    setTimeout(() => setPdfInstruction(false), 8000);
  };

  // calculate percentage
  // Example data
  const sellerData = {
    totalSales: sellerSlice?.report?.totalSales || 0,
    totalOrders: sellerSlice?.report?.totalOrders || 0,
    // previous sales for percent increase calculation
    previousTotalSales:
      sellerSlice?.report?.previousTotalSales || 0,
    totalEarnings: sellerSlice?.report?.totalEarnings || 0,
  };

  const stats = calculateSellerStats(sellerData);

  if (sellerSlice.loading && !sellerSlice) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader size={48} className="text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 print:bg-white print:p-0 relative">
      {/* PDF Help Notification */}
      <AnimatePresence>
        {pdfInstruction && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md print:hidden"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <Info size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Opening Print Dialog...</p>
              <p className="text-xs text-indigo-100">
                Select "Save as PDF" in the Destination menu of the print
                window.
              </p>
            </div>
            <button
              onClick={() => setPdfInstruction(false)}
              className="ml-2 opacity-60 hover:opacity-100"
            >
              <XCircle size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Seller Dashboard
          </h1>
          <p className="text-slate-500 flex items-center mt-1 text-sm">
            <Clock size={14} className="mr-2" />
            Live data from{" "}
            {new Date(sellerSlice.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download size={16} />
              Export
              <ChevronDown
                size={14}
                className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <button
                    onClick={exportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <FileText size={16} className="text-rose-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">PDF Report</p>
                      <p className="text-[10px] text-slate-400">
                        Save as PDF document
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={exportCSV}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <FileSpreadsheet size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">
                        Excel / CSV
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Standard data format
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={exportDOC}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FileText size={16} className="text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Word DOC</p>
                      <p className="text-[10px] text-slate-400">
                        Text report summary
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={exportJSON}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <FileJson size={16} className="text-amber-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">JSON Data</p>
                      <p className="text-[10px] text-slate-400">
                        Developer raw data
                      </p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Sync Data
          </button> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2 print:gap-8">
          <StatCard
            title="Net Earnings"
            value={`₹${(sellerSlice?.report?.totalEarnings || 0).toFixed(2)}`}
            icon={Wallet2}
            color="bg-emerald-500"
            percent={stats.percentIncrease}
          />
          <StatCard
            title="Total Sales"
            value={`₹${(sellerSlice?.report?.totalSales || 0).toFixed(2)}`}
            icon={IndianRupee}
            color="bg-blue-500"
            percent={stats.percentIncrease}
          />
          <StatCard
            title="Total Orders"
            value={sellerSlice?.report?.totalOrders || 0}
            icon={Package}
            color="bg-indigo-500"
            percent={stats.marketShare}
          />
          <StatCard
            title="Canceled Orders"
            value={sellerSlice?.report?.canceledOrder || 0}
            icon={PackageX}
            color="bg-rose-500"
            percent={0}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2 print:gap-8">
          <StatCard
            title="Total Earnings"
            value={`₹${(sellerSlice?.report?.totalEarnings || 0).toFixed(2)}`}
            icon={TrendingUpIcon}
            color="bg-purple-500"
            percent={stats.percentIncrease}
          />
          <StatCard
            title="Total Refunds"
            value={`₹${(sellerSlice?.report?.totalRefunds || 0).toFixed(2)}`}
            icon={Package}
            color="bg-orange-500"
            percent={0}
          />
          <StatCard
            title="Total Tax"
            value={`₹${stats.calculatedTax}`}
            icon={IndianRupee}
            color="bg-cyan-500"
            percent={0}
          />
          <StatCard
            title="Transactions"
            value={sellerSlice?.report?.totalOrders || 0}
            icon={IndianRupee}
            color="bg-pink-500"
            percent={0}
          />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 print:shadow-none print:border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Sales Trend</h2>
              <p className="text-sm text-slate-500">
                Overview of order distribution
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => toggleLine("orders")}
                className={`w-3 h-3 rounded-full transition-all ${activeLines.orders ? "bg-indigo-500 scale-125" : "bg-slate-200 hover:bg-indigo-200"}`}
              />
              <button
                onClick={() => toggleLine("canceled")}
                className={`w-3 h-3 rounded-full transition-all ${activeLines.canceled ? "bg-rose-500 scale-125" : "bg-slate-200 hover:bg-rose-200"}`}
              />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip />
                {activeLines.orders && (
                  <Area
                    type="monotone"
                    dataKey="totalOrders"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#g1)"
                  />
                )}
                {activeLines.canceled && (
                  <Area
                    type="monotone"
                    dataKey="Canceled Orders"
                    stroke="#f43f5e"
                    strokeWidth={3}
                    fill="url(#g2)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-4">
              Seller Information & Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Seller ID
                </p>
                <p className="text-sm font-mono text-slate-700 mt-1 truncate">
                  {sellerSlice?.report?.seller || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Report ID
                </p>
                <p className="text-sm font-mono text-slate-700 mt-1 truncate">
                  {sellerSlice?.report._id || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Created
                </p>
                <p className="text-sm font-mono text-slate-700 mt-1 truncate">
                  {new Date(sellerSlice?.report?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Last Updated
                </p>
                <p className="text-sm font-mono text-slate-700 mt-1 truncate">
                  {new Date(sellerSlice?.report?.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Total Transactions
                </p>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  {sellerSlice?.report?.totalTransactions || 0}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Report Version
                </p>
                <p className="text-sm font-mono text-slate-700 mt-1">
                  v{sellerSlice?.report?.__v || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h3 className="text-xl font-bold mb-2">Need help?</h3>
            <p className="text-slate-400 text-sm">
              Our support team is available 24/7 to assist with your seller
              account configurations.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden print:block mt-12 border-t pt-6 text-center">
        <p className="text-lg font-bold text-slate-900">
          Seller Performance Report
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Generated on {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
