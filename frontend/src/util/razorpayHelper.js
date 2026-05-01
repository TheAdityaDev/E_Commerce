import { axiosInstance } from "../config/api.config";
import { paymentSuccess } from "../Redux Toolkit/Features/Customer/orderSlice";

/**
 * Initialize and open Razorpay payment modal
 * @param {Object} config - Configuration object
 * @param {number} config.amount - Amount in INR (will be converted to paise)
 * @param {string} config.orderId - Order ID
 * @param {Object} config.user - User object { name, email, mobile }
 * @param {string} config.token - Auth token
 * @param {Function} config.onSuccess - Success callback
 * @param {Function} config.onError - Error callback
 * @returns {Promise<void>}
 */
export const openRazorpayPayment = async (config) => {
  const { amount, orderId, user, token, onSuccess, onError, dispatch } = config;

  try {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      await loadRazorpayScript();
    }

    // Amount from backend already includes: Selling Price + Shipping - Coupon Discount
    const finalAmount = Number(amount);
    const amountInPaise = Math.round(finalAmount * 100);

    // Razorpay options with teal theme
    const razorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amountInPaise, // Convert to paise
      currency: "INR",
      reference_id: orderId, // Use reference_id instead of order_id

      description: `Payment for Order #${orderId}`,

      // Customer details
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile ? `+91${user.mobile}` : "",
      },

      // Teal theme color
      theme: {
        color: "#008B8B", // Teal color
      },

      // Handlers
      handler: async (response) => {
        console.log("✅ Payment Success:", response);

        if (onSuccess) {
          await onSuccess(response);
          dispatch(
            paymentSuccess({
              token: token,
              paymentId: response.razorpay_payment_id,
              // our `orderId` here is the backend PaymentOrder _id
              paymentOrderId: orderId,
              paymentLinkId: response.razorpay_order_id, // This is Razorpay's order ID
            }),
          );
        }
      },

      modal: {
        ondismiss: () => {
          console.log("❌ Payment modal closed");
          if (onError) {
            onError(new Error("Payment cancelled by user"));
          }
        },
      },
    };

    console.log("🚀 Opening Razorpay with options:", razorpayOptions);

    // Create and open Razorpay instance
    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    console.error("❌ Razorpay Error:", error);
    if (onError) {
      onError(error);
    }
  }
};

/**
 * Load Razorpay script dynamically
 * @returns {Promise<boolean>}
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Razorpay script loaded");
      resolve(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Razorpay script");
      reject(new Error("Failed to load Razorpay script"));
    };
    document.body.appendChild(script);
  });
};

/**
 * Verify payment with backend
 * @param {Object} paymentData - Payment data from Razorpay
 * @param {string} token - Auth token
 * @returns {Promise<Object>}
 */
export const verifyRazorpayPayment = async (paymentData, token) => {
  try {
    const response = await axiosInstance.post(
      "/payment/verify",
      {
        razorpay_order_id: paymentData.razorpay_order_id,   
        razorpay_payment_id: paymentData.razorpay_payment_id, 
        razorpay_signature: paymentData.razorpay_signature,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    throw error;
  }
};
