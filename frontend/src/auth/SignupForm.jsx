import {
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux Toolkit/store";
import { useNavigate } from "react-router-dom";
import {
  sendLoginSignUpOtp,
  signup,
} from "../Redux Toolkit/Features/Auth/AuthSlice";
import { toast } from "react-toastify";
import { Eye, EyeClosedIcon } from "lucide-react";

const steps = ["Verify Email", "Fill Details"];

// ─── Only used for FINAL submit (Step 1) ────────────────
const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name too short").required("Name is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Must be 10 digits")
    .required("Mobile is required"),
  alternateNumber: Yup.string()
    .matches(/^\d{10}$/, "Must be 10 digits")
    .notRequired(),
});

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { auth } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      name: "",
      password: "",
      mobile: "",
      alternateNumber: "",
    },
    // ✅ Validation ONLY on final submit
    validationSchema: activeStep === 1 ? SignupSchema : undefined,

    onSubmit: (values) => {
      dispatch(signup({ ...values, navigate }))
      .unwrap()
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // ─── Step 0a: Send OTP (type="button", no form submit) ──
  const handleSendOtp = () => {
    const email = formik.values.email.trim();
    if (!email) {
      formik.setFieldTouched("email", true);
      formik.setFieldError("email", "Email is required");
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formik.setFieldTouched("email", true);
      formik.setFieldError("email", "Enter a valid email");
      toast.error("Invalid email format");
      return;
    }

    dispatch(sendLoginSignUpOtp(email))
      .unwrap()
  };

  // ─── Step 0b: Verify OTP → go to Step 1 ─────────────────
  const handleVerifyOtp = () => {
    const otp = formik.values.otp.trim();

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      formik.setFieldTouched("otp", true);
      formik.setFieldError("otp", "Enter valid 6-digit OTP");
      return;
    }

    // ✅ Move to step 1
    setActiveStep(1);
    formik.setTouched({});
  };

  // ─── Step 0 button handler ───────────────────────────────
  const handleStep0Click = () => {
    if (!auth.otpSent) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  // ─── Back to Step 0 ─────────────────────────────────────
  const handleBack = () => {
    setActiveStep(0);
    formik.setTouched({});
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
      {/* ── Stepper ─────────────────────────────────────── */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ════════════════════════════════════════════════════
          STEP 0 — Email + OTP
         ════════════════════════════════════════════════════ */}
      {activeStep === 0 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-center">
            {auth.otpSent ? "Enter OTP" : "Verify Your Email"}
          </h2>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={auth.otpSent}
            required
            autoFocus
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {auth.otpSent && (
            <TextField
              fullWidth
              label="Enter 6-digit OTP"
              name="otp"
              type="text"
              inputMode="numeric"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              autoFocus
              inputProps={{ maxLength: 6 }}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
            />
          )}

          {/* ✅ type="button" — does NOT trigger form submit */}
          <Button
            fullWidth
            variant="contained"
            type="button"
            onClick={handleStep0Click}
            disabled={
              auth.loading ||
              (!auth.otpSent && !formik.values.email) ||
              (auth.otpSent && !formik.values.otp)
            }
            sx={{
              py: 1.5,
              borderRadius: "10px",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {auth.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : auth.otpSent ? (
              "Verify & Continue →"
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 1 — User Details
         ════════════════════════════════════════════════════ */}
      {activeStep === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-center">
            Create Your Account
          </h2>

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            autoFocus
            inputMode="text"
            enterKeyHint="next"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <div className="relative w-full">
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              inputMode="text"
              enterKeyHint="next"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <button
              className="absolute right-3 mt-4 cursor-pointer"
              onClick={handleTogglePassword}
            >
              {showPassword ? <EyeClosedIcon /> : <Eye />}
            </button>
          </div>

          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            type="tel"
            inputMode="tel"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            inputProps={{ maxLength: 10 }}
            enterKeyHint="next"
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />

          <TextField
            fullWidth
            label="Alternate Mobile (Optional)"
            name="alternateNumber"
            type="tel"
            inputMode="tel"
            value={formik.values.alternateNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputProps={{ maxLength: 10 }}
            enterKeyHint="next"
            error={
              formik.touched.alternateNumber &&
              Boolean(formik.errors.alternateNumber)
            }
            helperText={
              formik.touched.alternateNumber && formik.errors.alternateNumber
            }
          />

          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outlined"
              type="button"
              onClick={handleBack}
              sx={{
                py: 1.5,
                borderRadius: "10px",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              ← Back
            </Button>

            {/* ✅ type="submit" — triggers formik.handleSubmit */}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={auth.loading}
              sx={{
                py: 1.5,
                borderRadius: "10px",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              {auth.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SignupForm;
