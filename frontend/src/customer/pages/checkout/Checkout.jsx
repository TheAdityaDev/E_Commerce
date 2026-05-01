import Button from "@mui/material/Button";
import AddressCard from "./AddressCard";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import { Box, CircularProgress } from "@mui/material";
import AddressForm from "./AddressForm";
import PricingCard from "../Cart/PricingCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import secureLocalStorage from "react-secure-storage";
import { createOrder } from "../../../Redux Toolkit/Features/Customer/orderSlice";
import { openRazorpayPayment } from "../../../util/razorpayHelper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  p: 4,
};

const Checkout = () => {
  const dispatch = useAppDispatch();
  const [selectedAddress, setSelectedAddress] = useState(2);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handelChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const { user } = useAppSelector((state) => state.user);
  const couponState = useAppSelector((store) => store.coupon);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [currentPaymentOrderId, setCurrentPaymentOrderId] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(null);

  const navigate = useNavigate();

  const createOrders = async () => {
    const token = secureLocalStorage.getItem("token");
    setIsCreating(true);
    try {
      console.log("Step 1: Creating order...");
      const payload = await dispatch(
        createOrder({
          token,
          paymentGateway: "razorpay",
          address: selectedAddress,
          discount: couponState.coupon?.discount,
          couponCode: couponState.appliedCode,
        }),
      ).unwrap();

      if (payload?.paymentOrderId) {
        console.log("Order created successfully!");
        setCurrentPaymentOrderId(payload.paymentOrderId);
        setCurrentAmount(payload.amount);

        setOrderCreated(true);
        toast.success("Order created! Ready for payment.");
      } else {
        toast.error("Failed to create order");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to create order");
    } finally {
      setIsCreating(false);
    }
  };


  const handleRazorpayPayment = async () => {
    const token = secureLocalStorage.getItem("token");

    if (!currentPaymentOrderId || !currentAmount) {
      toast.error("Payment information missing. Please create order again.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      await openRazorpayPayment({
        amount: currentAmount,
        orderId: currentPaymentOrderId,
        user: {
          name: user?.name,
          email: user?.email,
          mobile: user?.mobile,
          
          dispatch,
        },
        token: token,

        onSuccess: async (response) => {
          console.log("Payment successful:", response);
          toast.success("Payment successful!");

          // Redirect to success page
          navigate(
            `/payment/success/${currentPaymentOrderId}?razorpay_payment_id=${response?.razorpay_payment_id || ""}`,
          );
          setOrderCreated(false);
          setCurrentPaymentOrderId(null);
          setCurrentAmount(null);
        },

        onError: (error) => {
          console.error("Payment failed:", error);
          toast.error(error?.message || "Payment failed");
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to initialize Razorpay payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen">
      <div className="space-y-5 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-5">
        <div className="col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Select Delivery Address</span>
            <Button onClick={handleOpen} variant="outlined">
              Add New Address
            </Button>
          </div>
          <div className="text-xs font-medium space-y-5">
            <p>Saved Addresses</p>
            <div className="space-y-3">
              {user?.address?.map((item, index) => (
                <AddressCard
                  key={index._id || index}
                  value={item}
                  item={item}
                  selectedValue={selectedAddress}
                  handleChange={handelChange}
                />
              ))}
            </div>
            <div className="px-2 py-3 rounded-md border">
              <Button
                onClick={handleOpen}
                startIcon={<Plus className="size-5" />}
              >
                Add New Address
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-1 text-sm space-y-3">
          <section className="space-y-3 border p-5 rounded-md">
            <h1 className="font-semibold pb-2 text-center text-teal-700">
              Razorpay Checkout
            </h1>
            <p className="text-xs text-gray-600 text-center">
              Fast & Secure Payment Gateway
            </p>
          </section>
          <section>
            <PricingCard discount={couponState.coupon?.discount} />
            <div className="p-5">
              {!orderCreated ? (
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  type="submit"
                  onClick={createOrders}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Place Order"
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-green-700 font-semibold">
                      Order Created!
                    </p>
                    <p className="text-sm text-green-600">
                      Proceed to secure payment
                    </p>
                  </div>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleRazorpayPayment}
                    disabled={isProcessingPayment}
                    sx={{
                      bgcolor: "#008B8B",
                      "&:hover": { bgcolor: "#006666" },
                    }}
                  >
                    {isProcessingPayment ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Pay with Razorpay"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddressForm paymentGateway="razorpay" />
        </Box>
      </Modal>
    </div>
  );
};

export default Checkout;
