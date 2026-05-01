import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useFormik } from "formik";
import {
  resetPassword,
  sendLoginSignUpOtp,
} from "../../Redux Toolkit/Features/Auth/AuthSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ForgetPassword = () => {
  const { auth } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", otp: "", password: "", confirmPassword: "" },
    onSubmit: (values) => {
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      dispatch(resetPassword({ 
        email: formik.values.email,
        password: values.password, 
        otp: values.otp 
      }))
      .unwrap()
      .then(() => {
        setOtpVerified(false);
        formik.resetForm();
      })
      .catch((error) => {
        console.error("Reset failed:", error);
      });
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSendOtp = () => {
    if (!formik.values.email) {
      toast.error("Please enter your email");
      return;
    }
    const email = "signin_" + formik.values.email;
    dispatch(sendLoginSignUpOtp(email))
      .unwrap()
      .catch((error) => {
        console.error("Failed to send OTP:", error);
      });
  };

  const handleVerifyOtp = () => {
    if (!formik.values.otp || formik.values.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    // For now, we'll just mark OTP as verified
    // In a full implementation, you'd call verifyOTP thunk
    toast.success("OTP will be verified during password reset");
    setOtpVerified(true);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={formik.handleSubmit}
      noValidate
      className="flex flex-col items-center w-full max-w-md mx-auto px-6 py-8"
    >
      <AnimatePresence mode="wait">
        <motion.h2
          key={auth.otpSent + otpVerified}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="text-2xl font-bold mb-6 text-center"
        >
          {auth.otpSent
            ? otpVerified
              ? "Reset Password"
              : "Verify OTP"
            : "Enter Email"}
        </motion.h2>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Email */}
        {!auth.otpSent && (
          <motion.div
            key="email-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </motion.div>
        )}

        {/* OTP Verification */}
        {auth.otpSent && !otpVerified && (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 w-full"
          >
            <TextField
              fullWidth
              label="Enter 6 digit OTP"
              type="number"
              inputMode="numeric"
              name="otp"
              autoFocus
              value={formik.values.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                formik.setFieldValue("otp", value);
              }}
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 6 }}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
            />
          </motion.div>
        )}

        {/* OTP + Password */}
        {auth.otpSent && otpVerified && (
          <motion.div
            key="password-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 w-full"
          >
            {/* Password */}
            <div className="relative w-full">
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-4 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative w-full">
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />

              <button
                type="button"
                onClick={toggleConfirmPassword}
                className="absolute right-3 top-4 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="w-full mt-6 flex flex-col gap-3">
        {!auth.otpSent ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
            fullWidth
            variant="contained"
            type="button"
            onClick={handleSendOtp}
            disabled={
                auth.loading || !formik.values.email || Boolean(formik.errors.email)
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {auth.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send OTP"
            )}
            </Button>
          </motion.div>
        ) : !otpVerified ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
            fullWidth
            variant="contained"
            type="button"
            onClick={handleVerifyOtp}
            disabled={
              auth.loading ||
              !formik.values.otp ||
              formik.values.otp.length !== 6
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {auth.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify OTP"
            )}
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={
              auth.loading ||
              !formik.values.password ||
              !formik.values.confirmPassword ||
              formik.values.password !== formik.values.confirmPassword ||
              Boolean(formik.errors.password) ||
              Boolean(formik.errors.confirmPassword)
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {auth.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Set New Password"
            )}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.form>
  );
};

export default ForgetPassword;
