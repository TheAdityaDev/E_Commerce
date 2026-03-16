import Button from "@mui/material/Button";
import AddressCard from "./AddressCard";
import { Plus } from "lucide-react";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import AddressForm from "./AddressForm";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import PricingCard from "../Cart/PricingCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  p: 4,
};

const paymentGatewayList = [
  {
    name: "razorpay",
    image:
      "https://w7.pngwing.com/pngs/93/992/png-transparent-razorpay-logo-tech-companies-thumbnail.png",
  },
  {
    name: "Stripe",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc_b7cYDTEaXxYsRDAdsVXYknigIr16CNbZQ&s",
  },
];

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState(2);
  const [open, setOpen] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState(
    paymentGatewayList[0].name,
  );
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handelChange = (e) => {
    setSelectedAddress(e.target.value);
    console.log(e.target.value);
  };

  const handlePaymentGatewayChange = (e) => {
    setPaymentGateway(e.target.value);
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
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <AddressCard
                  key={index}
                  value={item}
                  selectedValue={selectedAddress}
                  handelChange={handelChange}
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
            <h1 className="font-semibold pb-2 text-center text-green-700">
              Choose Payment Gateway
            </h1>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={paymentGateway}
              onChange={handlePaymentGatewayChange}
            >
              {paymentGatewayList.map((item, i) => (
                <span className="flex justify-between mx-2">
                  <FormControlLabel
                    key={i}
                    value={item.name}
                    control={<Radio />}
                  />
                  <img
                  loading="lazy"
                    className="object-contain h-20 w-20"
                    src={item.image}
                    alt={item.name}
                  />
                </span>
              ))}
            </RadioGroup>
          </section>
          <section>
            <PricingCard />
            <div className="p-5">
              <Button
                fullWidth
                sx={{ px: "11px" }}
                variant="contained"
                size="large"
              >
                Place Order
              </Button>
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
          <AddressForm />
        </Box>
      </Modal>
    </div>
  );
};

export default Checkout;
