import { TextField } from "@mui/material";
import { Eye, EyeClosedIcon } from "lucide-react";
import React, { useState } from "react";

const SellerStep4 = ({ formik }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-5 p-5">
      <div>
        <TextField
          fullWidth
          type="text"
          label="Business Name"
          inputMode="text"
          InputProps={{ inputProps: { maxLength: 20 } }}
          name="businessDetails.businessName"
          value={formik.values.businessDetails.businessName}
          onChange={formik.handleChange}
          error={
            formik.touched.businessDetails?.businessName &&
            Boolean(formik.errors.businessDetails)
          }
          helperText={
            formik.touched.businessDetails?.businessName &&
            formik.errors.businessDetails?.businessName
          }
          required
        />
      </div>
      <div>
        <TextField
          fullWidth
          type="email"
          label="Business Email"
          inputMode="email"
          InputProps={{ inputProps: { maxLength: 20 } }}
          name="businessDetails.businessEmail"
          value={formik.values.businessDetails.businessEmail}
          onChange={formik.handleChange}
          error={
            formik.touched.businessDetails?.businessEmail &&
            Boolean(formik.errors.businessDetails)
          }
          helperText={
            formik.touched.businessDetails?.businessEmail &&
            formik.errors.businessDetails?.businessEmail
          }
          required
        />
      </div>

      <div>
        <TextField
          fullWidth
          type="tel"
          label="Business Phone Number"
          inputMode="tel"
          InputProps={{ inputProps: { maxLength: 10 } }}
          name="businessDetails.businessPhone"
          value={formik.values.businessDetails.businessPhone}
          onChange={formik.handleChange}
          error={
            formik.touched.businessDetails?.businessPhone &&
            Boolean(formik.errors.businessDetails?.businessPhone)
          }
          helperText={
            formik.touched.businessDetails?.businessPhone &&
            formik.errors.businessDetails?.businessPhone
          }
          required
        />
      </div>

      <div>
        <TextField
          fullWidth
          type="text"
          label="Business Address"
          inputMode="text"
          InputProps={{ inputProps: { maxLength: 30 } }}
          name="businessDetails.businessAddress"
          value={formik.values.businessDetails.businessAddress}
          onChange={formik.handleChange}
          error={
            formik.touched.businessDetails?.businessAddress &&
            Boolean(formik.errors.businessDetails)
          }
          helperText={
            formik.touched.businessDetails?.businessAddress &&
            formik.errors.businessDetails?.businessAddress
          }
          required
        />
      </div>
      <div className="relative flex items-center">
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Password"
          inputMode="text"
          name="password"
          enterKeyHint="next"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={
            formik.touched.password && Boolean(formik.errors.businessDetails)
          }
          helperText={formik.touched.password && formik.errors.password}
          required
        />
        <button
          className="absolute right-3 cursor-pointer"
          onClick={handleTogglePassword}
        >
          {showPassword ? <EyeClosedIcon /> : <Eye />}
        </button>
      </div>
    </div>
  );
};

export default SellerStep4;
