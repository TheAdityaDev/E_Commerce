import { TextField } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";

const SellerStep3 = ({ formik }) => {
  const fetchBankDetails = async (ifsc) => {
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);

      if (res === "FAILED") {
        toast.error("Something went wrong...");
        fetchBankDetails(ifsc);
      }

      const data = await res.json();

      formik.setFieldValue("bankDetails.bankName", data.BANK);
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };
  return (
    <div className="space-y-5 p-5">
      <div>
        <TextField
          fullWidth
          type="text"
          label="Account Holder Name"
          inputMode="text"
          name="bankDetails.accountHolderName"
          enterKeyHint="next"
          InputProps={{ inputProps: { maxLength: 20 } }}
          value={formik.values.bankDetails.accountHolderName}
          onChange={formik.handleChange}
          error={
            formik.touched.bankDetails?.accountHolderName &&
            Boolean(formik.errors.bankDetails?.accountHolderName)
          }
          helperText={
            formik.touched.bankDetails?.accountHolderName &&
            formik.errors.bankDetails?.accountHolderName
          }
          required
        />
      </div>
      <div>
        <TextField
          fullWidth
          type="number"
          label="Account Number"
          inputMode="decimal"
          InputProps={{ inputProps: { maxLength: 17 } }}
          name="bankDetails.accountNumber"
          value={formik.values.bankDetails.accountNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.bankDetails?.accountNumber &&
            Boolean(formik.errors.bankDetails)
          }
          helperText={
            formik.touched.bankDetails?.accountNumbers &&
            formik.errors.bankDetails
          }
          required
        />
      </div>
      <div>
        <TextField
          fullWidth
          type="text"
          label="IFSC Code"
          inputMode="text"
          name="bankDetails.IFSC_Code"
          value={formik.values.bankDetails.IFSC_Code?.toUpperCase() || ""}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();

            // ✅ correct field update
            formik.setFieldValue("bankDetails.IFSC_Code", value);

            // ✅ IFSC validation (11 chars)
            const isValidIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);

            if (isValidIFSC) {
              fetchBankDetails(value);
            }
          }}
          error={
            formik.touched.bankDetails?.IFSC_Code &&
            Boolean(formik.errors.bankDetails?.IFSC_Code)
          }
          helperText={
            formik.touched.bankDetails?.IFSC_Code &&
            formik.errors.bankDetails?.IFSC_Code
          }
          inputProps={{ maxLength: 11 }}
          required
        />
      </div>
      <div>
        <TextField
          fullWidth
          type="text"
          label="Bank Name"
          inputMode="text"
          name="bankDetails.bankName"
          enterKeyHint="next"
          InputProps={{ inputProps: { maxLength: 20 } }}
          value={formik.values.bankDetails.bankName}
          onChange={formik.handleChange}
          error={
            formik.touched.bankDetails?.bankName &&
            Boolean(formik.errors.bankDetails?.bankName)
          }
          helperText={
            formik.touched.bankDetails?.bankName &&
            formik.errors.bankDetails?.bankName
          }
          required
        />
      </div>
    </div>
  );
};

export default SellerStep3;
