import { Button, TextField, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../Redux Toolkit/store";
import {
  sendLoginSignUpOtp,
  signin,
} from "../Redux Toolkit/Features/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth } = useAppSelector((state) => state);

  const [showPassword, setShowPassword] = useState(false);

  // Validation Schemas
  const EmailSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
  });

  const LoginSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .matches(/^\d+$/, "OTP must be numeric")
      .required("OTP is required"),

    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
    },

    validationSchema: auth.otpSent ? LoginSchema : EmailSchema,

    onSubmit: (values) => {
      dispatch(signin({ ...values, navigate }))
        .then(() => {
          navigate("/")
          toast.success("Login successful 🎉");
        })
        .catch(() => {
          toast.error("Invalid credentials ❌");
        });
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSendOtp = () => {
    const email = "signin_" + formik.values.email.trim();

    if (!email) {
      formik.setFieldTouched("email", true);
      formik.setFieldError("email", "Email is required");
      toast.error("Please enter email");
      return;
    }

    dispatch(sendLoginSignUpOtp(email))
      .unwrap()
      .then(() => toast.success("OTP sent successfully ✅"))
      .catch(() => toast.error("Failed to send OTP ❌"));
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="flex flex-col items-center w-full max-w-md mx-auto px-6 py-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        {auth.otpSent ? "Login" : "Enter Email"}
      </h2>

      {/* Email */}
      {!auth.otpSent && (
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
      )}

      {/* OTP + Password */}
      {auth.otpSent && (
        <div className="flex flex-col gap-4 w-full">
          {/* OTP */}
          <TextField
            fullWidth
            label="Enter 6 digit OTP"
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

          {/* Password */}
          <div className="relative w-full">
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password &&
                Boolean(formik.errors.password)
              }
              helperText={
                formik.touched.password && formik.errors.password
              }
            />

            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-4 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="w-full mt-6">
        {!auth.otpSent ? (
          <Button
            fullWidth
            variant="contained"
            type="button"
            onClick={handleSendOtp}
            disabled={
              auth.loading ||
              !formik.values.email ||
              Boolean(formik.errors.email)
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
        ) : (
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={
              auth.loading ||
              !formik.values.otp ||
              !formik.values.password ||
              Boolean(formik.errors.otp) ||
              Boolean(formik.errors.password)
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
              "Login"
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default LoginForm;