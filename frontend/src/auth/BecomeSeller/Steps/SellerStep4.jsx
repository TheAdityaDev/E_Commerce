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
          name="businessDetails.businessMobile"
          value={formik.values.businessDetails.businessMobile}
          onChange={formik.handleChange}
          error={
            formik.touched.businessDetails?.businessMobile &&
            Boolean(formik.errors.businessDetails?.businessMobile)
          }
          helperText={
            formik.touched.businessDetails?.businessMobile &&
            formik.errors.businessDetails?.businessMobile
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
            formik.touched.password &&
            Boolean(formik.errors.businessDetails)
          }
          helperText={
            formik.touched.password &&
            formik.errors.password
          }
          required
        />
         <button className="absolute right-3 cursor-pointer" onClick={handleTogglePassword}>
                {showPassword ? <EyeClosedIcon /> : <Eye />}
            </button>
      </div>
    </div>
  );
};

export default SellerStep4;
