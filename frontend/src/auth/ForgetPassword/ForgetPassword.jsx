import { Button, TextField } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useFormik } from "formik";
import { resetPassword } from "../../Redux Toolkit/Features/Auth/AuthSlice";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const { auth } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: { email: "", otp: "", password: "" },
    onSubmit: (values) => {
      dispatch(resetPassword({ ...values }))
        .unwrap()
        .then(() => {
          toast.success("Password reset successful! 🎉");
        })
        .catch(() => {
          // Always generic message for security
          toast.error("Invalid credentials ❌");
        });
    },
  });
  return (
    <div className="min-h-screen  flex items-start justify-center bg-gray-100 px-4 py-4 lg:items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        {/* Image */}
        <div className="h-60 sm:h-52 overflow-hidden rounded-t-2xl lg:h-40">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=600&auto=format&fit=crop&q=60"
            alt="auth"
          />
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          <Link
            to="/"
            className="text-sm mt-5 underline-offset-2 text-teal-400 flex items-end justify-end hover:underline duration-150"
          >
            Go Back
          </Link>

          <div className="flex flex-col items-center justify-center gap-1 mt-6 text-sm space-y-5">
            <p className="text-gray-700/80 font-bold text-xl">Enter your registered email.</p>
            <TextField
              type="email"
              name="email"
              fullWidth
              label="Email"
              inputMode="email"
              enterKeyHint="next"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              autoFocus
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <Button
              type="button"
              variant="contained"
              fullWidth
              sx={{ py: "12px", mt: 3 }}
              className="text-teal-600 font-medium hover:underline"
            >
              Get OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
