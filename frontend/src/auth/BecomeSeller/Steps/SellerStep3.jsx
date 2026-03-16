import { TextField } from "@mui/material";
import React from "react";

const SellerStep3 = ({ formik }) => {
  return (
    <div className="space-y-5 p-5">
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
        InputProps={{ inputProps: { maxLength: 11 } }}
        name="bankDetails.ifscCode"
        value={formik.values.bankDetails.ifscCode?.toUpperCase()}
        onChange={formik.handleChange}
        error={formik.touched.bankDetails && Boolean(formik.errors.bankDetails)}
        helperText={formik.touched.bankDetails && formik.errors.bankDetails}
        required
      />
      </div>

      <TextField
        fullWidth
        type="text"
        label="Account Holder Name"
        inputMode="text"
        name="bankDetails.accountHolderName"
        enterKeyHint="next"
        InputProps={{ inputProps: { maxLength: 30 } }}
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
  );
};

export default SellerStep3;
