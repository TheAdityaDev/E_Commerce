import { useFormik } from "formik";
import React, { lazy, Suspense, useState } from "react";
import { Button, Step, StepLabel, Stepper } from "@mui/material";

const SellerStep1 = lazy(
  () => import("./Steps/SellerStep1"),
);
const SellerStep2 = lazy(
  () => import("./Steps/SellerStep2"),
);
const SellerStep3 = lazy(
  () => import("./Steps/SellerStep3"),
);
const SellerStep4 = lazy(
  () => import("./Steps/SellerStep4"),
);

import { useAppDispatch } from "../../Redux Toolkit/store";
import { createSeller } from "../../Redux Toolkit/Features/Seller/sellerAuthentication";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const steps = [
  "Tax Details & Mobile",
  "Pickup Address",
  "Bank Details",
  "Business Details",
];

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  

  const formik = useFormik({
    initialValues: {
      mobile: "",
      GSTIN: "",
      pickupDetails: {
        address: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
      },
      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        IFSC_Code: "",
        bankName: "",
      },
      sellerName: "",
      email: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessPhone: "",
        businessAddress: "",
      },
      password: "",
    },
    
/**
 * Called when the form is submitted.
 * @param {Object} values - The current values of the form.
 */
    onSubmit: (values) => {

      dispatch(createSeller({ ...values, navigate }))
      .then(() => {
        console.log(values)
        navigate("/seller")
      })
      .catch(() => {
        toast.error("Invalid credentials ❌");
      });
    },
  });


  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label} className="mt-10">
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-20 space-y-10 ">
        <Suspense fallback={<div>Loading...</div>}>
        {activeStep == 0 ? (
          <SellerStep1 formik={formik} />
        ) : activeStep == 1 ? (
          <SellerStep2 formik={formik} />
        ) : activeStep == 2 ? (
          <SellerStep3 formik={formik} />
        ) : (
          <SellerStep4 formik={formik} />
        )}
      </Suspense>
      </div>
      <div className="flex items-center justify-between p-5">
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={
            activeStep === steps.length - 1
              ? formik.handleSubmit
              : () => setActiveStep(activeStep + 1)
          }
          disabled={!(formik.isValid && formik.dirty)}

        >
          {activeStep === steps.length - 1 ? "Create Account" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default SellerAccountForm;
