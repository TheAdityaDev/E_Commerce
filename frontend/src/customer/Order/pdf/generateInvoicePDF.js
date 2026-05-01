import jsPDF from "jspdf";
import QRCode from "qrcode"
import { logo, logoImage } from "../../json/common";


export   const generateInvoicePDF = async (tx) => {
    if (!tx) return alert("No data found");

    const doc = new jsPDF("p", "mm", "a4");

    const customer = tx?.customer || {};
    const order = tx?.order || {};
    const items = order?.orderItems || [];
    const address = customer?.address?.[0] || {};

    // =========================
    // 🛠 HELPERS
    // =========================
    const safeText = (v) => (v ? String(v) : "—");
    const split = (t, w) => doc.splitTextToSize(safeText(t), w);

    const format = (n) =>
      "Rs. " + Number(n || 0).toLocaleString("en-IN");

    const getDate = () =>
      tx?.date ? new Date(tx.date).toLocaleDateString("en-IN") : "—";

    // =========================
    // 💰 CALCULATIONS
    // =========================
    const totalMrpPrice = Number(order?.totalMrpPrice || 0);
    const totalSellingPrice = Number(order?.totalSellingPrice || 0);
    const discount = Number(order?.discount || 0);
    const shipping = 79;
    const finalTotal = Number(tx?.amount || totalSellingPrice + shipping);

    // =========================
    // 🌫️ WATERMARK
    // =========================
    const loadImage = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => resolve(img);
      });

    let watermark = await loadImage(
      `${logoImage.image}`
    );

    doc.setGState(new doc.GState({ opacity: 0.09 , blendMode: "multiply" , rotate: 45 }));
    doc.addImage(watermark, "PNG", 55, 100, 100, 100);
    doc.setGState(new doc.GState({ opacity: 1 }));

    // =========================
    // 🖤 HEADER
    // =========================
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 38, "F");

    doc.setTextColor(255, 225, 225);
    doc.setFontSize(22);
    doc.text(logo.name, 15, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("TAX INVOICE", 150, 18);

    doc.setFontSize(8);
    doc.text(`Invoice ID: ${tx?.paymentId || "—"}`, 150, 24);
    doc.text(`Date: ${getDate()}`, 150, 29);

    doc.setDrawColor(0, 0, 0);
    doc.line(0, 38, 210, 38);

    // =========================
    // 📦 CUSTOMER + ADDRESS
    // =========================
    let y = 48;

    doc.setFillColor(250, 250, 250);
    doc.rect(15, y, 85, 38, "FD");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("BILL TO", 18, y + 6);

    doc.setFontSize(8);
    let cy = y + 13;

    doc.text(split(customer?.name, 75), 18, cy);
    cy += 5;
    doc.text(split(customer?.email, 75), 18, cy);
    cy += 5;
    doc.text(`Mobile: +91 ${safeText(customer?.mobile)}`, 18, cy);

    doc.setFillColor(250, 250, 250);
    doc.rect(110, y, 85, 38, "FD");

    const addressText =
      [
        address?.fullAddress,
        address?.street,
        address?.locality,
        address?.city,
        address?.state,
        address?.pincode,
      ]
        .filter(Boolean)
        .join(", ") || "—";

    doc.setFontSize(10);
    doc.text("SHIPPING ADDRESS", 113, y + 6);

    doc.setFontSize(8);
    doc.text(split(addressText, 75), 113, y + 13);

    // =========================
    // 📦 TABLE
    // =========================
    y = 95;

    doc.setFillColor(0, 0, 0);
    doc.rect(15, y, 180, 10, "F");

    doc.setTextColor(255, 225, 225);
    doc.setFontSize(9);
    doc.text("Item", 18, y + 7);
    doc.text("Qty", 100, y + 7);
    doc.text("Price", 130, y + 7);
    doc.text("Total", 165, y + 7);

    y += 12;

    doc.setTextColor(0, 0, 0);

    items.forEach((item, i) => {
      const name = item?.product?.title || "Item";
      const qty = Number(item?.quantity) || 1;
      const price = Number(item?.sellingPrice) || 0;
      const total = qty * price;

      if (i % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, y, 180, 8, "F");
      }

      doc.text(name.substring(0, 35), 18, y + 5);
      doc.text(String(qty), 102, y + 5);
      doc.text(format(price), 130, y + 5);
      doc.text(format(total), 165, y + 5);

      y += 8;
    });

    // =========================
    // 💰 SUMMARY (✅ UPDATED WITH TOTAL)
    // =========================
    y += 10;

    doc.setFillColor(245, 245, 245);
    doc.rect(120, y, 75, 50, "FD");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);

    doc.text("MRP:", 123, y + 6);
    doc.text(format(totalMrpPrice), 163, y + 6);

    doc.text("Discount:", 123, y + 12);
    doc.text(`${format(discount)}`, 163, y + 12);

    doc.text("After Discount:", 123, y + 18);
    doc.text(format(totalSellingPrice), 163, y + 18);

    doc.text("Shipping:", 123, y + 24);
    doc.text(format(shipping), 163, y + 24);

    // ✅ Total Amount
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("TOTAL AMOUNT:", 123, y + 32);
    doc.text(format(finalTotal), 163, y + 32);

    // =========================
    // 📱 QR CODE (BOTTOM RIGHT)
    // =========================
    const qrUrl = `https://yourdomain.com/order/track/${order?._id}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl);

    doc.addImage(qrDataUrl, "PNG", 155, 240, 35, 35);

    doc.setFontSize(7);
    doc.text("Scan to Track Order", 160, 278);
    doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This is a computer-generated document. No signature is required. For any discrepancies, please contact support.",
    30,
    285,
  );

    // =========================
    // 💾 SAVE
    // =========================
    doc.save(`${logo.name}_Invoice_${tx?.paymentId || "Receipt"}_${Date.now()}.pdf`);
  };