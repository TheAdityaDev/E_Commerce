import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { logo, logoImage } from "../../json/common";

export const generateStatementPDF = async (
  transactions = [],
  fromDate,
  toDate,
  user,
) => {
  const doc = new jsPDF("p", "mm", "a4");

  // =========================
  // HELPERS
  // =========================
  const toNum = (v) => Number(String(v ?? 0).replace(/[^0-9.]/g, "")) || 0;

  const format = (n) => "Rs. " + toNum(n).toLocaleString("en-IN");

  const safeText = (t) => (t ? String(t) : "-");

  // =========================
  // WATERMARK
  // =========================
  const img =
    `${logoImage.image}`;

  try {
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.addImage(img, "PNG", 55, 100, 100, 100);
    doc.setGState(new doc.GState({ opacity: 1 }));
  } catch (e) {}

  // =========================
  // HEADER (Modern Dark Theme)
  // =========================
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 215, 0); // Gold
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(logo?.name || "SHOP", 15, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Customer: ${safeText(user?.name)}`, 15, 28);
  doc.text(`Email: ${safeText(user?.email)}`, 15, 34);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("ACCOUNT STATEMENT", 145, 18);

  doc.setFontSize(10);
  doc.text(`From: ${safeText(fromDate)}`, 145, 26);
  doc.text(`To: ${safeText(toDate)}`, 145, 32);

  // =========================
  // TABLE DATA
  // =========================
  const tableData = [];

  transactions.forEach((tx) => {
    const date = tx?.createdAt
      ? new Date(tx.createdAt).toLocaleDateString("en-IN")
      : "-";

    const items = tx?.order?.orderItems || [];

    if (!items.length) {
      tableData.push([
        date,
        "Order Payment",
        "1",
        format(tx.amount),
        format(tx.amount),
        safeText(tx.paymentStatus),
      ]);
      return;
    }

    const map = new Map();

    items.forEach((item) => {
      const name = safeText(item?.product?.title || item?.product?.name);
      const price = toNum(item?.sellingPrice || item?.product?.sellingPrice);
      const qty = toNum(item?.quantity || 1);
      const itemTotal = price * qty;

      if (map.has(name)) {
        const old = map.get(name);
        old.qty += qty;
        old.total += itemTotal;
      } else {
        map.set(name, {
          price,
          qty,
          total: itemTotal,
        });
      }
    });

    map.forEach((p, name) => {
      tableData.push([
        date,
        name,
        String(p.qty),
        format(p.price),
        format(p.total),
        safeText(tx.paymentStatus),
      ]);
    });
  });

  // =========================
  // TABLE (UPDATED HEAD)
  // =========================
  autoTable(doc, {
    startY: 50,
    head: [["Date", "Product", "Qty", "Price", "Total", "Status"]],
    body: tableData,
    theme: "striped",
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 215, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: "auto" },
      2: { halign: "center", cellWidth: 15 },
      3: { halign: "center", cellWidth: 30 },
      4: { halign: "center", cellWidth: 30 },
      5: { halign: "center", cellWidth: 25 },
    },
  });

  // =========================
  // QR CODE
  // =========================
  const finalY = doc.lastAutoTable.finalY || 150;
  const SHIPPING_FEE = 79;
  const totalAmount = transactions.reduce((sum, tx) => {
    const txAmount = toNum(tx.amount);
    // If transaction amount is already calculated with shipping in DB, use it,
    // otherwise ensure we reflect the logic used in payment service
    return sum + txAmount;
  }, 0);

  const qrUrl = `https://yourdomain.com/account/statements/${user?._id || "guest"}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);

  const qrY = 240; // Fixed bottom position

  // Total Amount (Placed after table, not aligned with QR)
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Transactions Value: ${format(totalAmount)}`, 15, finalY + 10);

  // Small Description at bottom
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This is a computer-generated document. No signature is required. For any discrepancies, please contact support.",
    30,
    285,
  );

  doc.addImage(qrDataUrl, "PNG", 165, qrY, 30, 30);
  doc.setFontSize(7);
  doc.text("Scan to Verify", 173, qrY + 33);

  // =========================
  // SAVE
  // =========================
  doc.save(`${logo?.name || "Shop"}_Statement_${Date.now()}.pdf`);
};
