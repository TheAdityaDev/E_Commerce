const paymentStatus = Object.freeze({
  PENDING: "Pending",
  FAILED:"Failed",
  PAID: "Paid",
  CONFIRMED:"Confirmed",
  PROCESSING:"Processing",
  CANCELLED: "Cancelled",
});

module.exports = paymentStatus;
