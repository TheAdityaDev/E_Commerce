import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { verifyLoginOtp } from "../../Redux Toolkit/Features/Seller/sellerAuthentication";
import { sendLoginSignUpOtp } from "../../Redux Toolkit/Features/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  otp: Yup.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .matches(/^\d+$/, "OTP must be numeric"),
});

const SellerLogin = () => {
  const auth = useAppSelector((store) => store.auth || {});

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

const formik = useFormik({
  initialValues: {
    email: "",
    otp: "",
  },
  validationSchema: validationSchema,
  onSubmit: async (values) => {
    try {
      await dispatch(verifyLoginOtp(values)).unwrap();

      navigate("/seller");

    } catch (error) {
      console.error(error);
    }
  },
});

  const handelSubmitOtp = (e) => {
    e.preventDefault();
    const email = "signin_" + formik.values.email;
    dispatch(sendLoginSignUpOtp(email));
  };
  return (
    <div className="mt-40">
      <p className="text-xl font-bold text-center pb-9">Contact Details</p>
      <form
        onSubmit={auth.otpSent ? formik.handleSubmit : handelSubmitOtp}
        className="p-5 space-y-5  md:p-5 lg:p-10"
      >
        <div>
          <TextField
            fullWidth
            id="email"
            type="email"
            label="Email"
            inputMode="email"
            name="email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </div>
        {auth.otpSent && (
          <div>
            <TextField
              fullWidth
              id="otp"
              InputProps={{ inputProps: { maxLength: 6 } }}
              type="number"
              label="otp"
              inputMode="numeric"
              name="otp"
              value={formik.values.otp}
              onChange={formik.handleChange}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
            />
          </div>
        )}
      </form>
      <div className="flex items-center justify-center mt-5">
        <Button
          onClick={auth.otpSent ? formik.handleSubmit : handelSubmitOtp}
          variant="contained"
          type="submit"
          className="px-5 py-5"
        >
          {auth.otpSent ? "Login" : "Send OTP"}
        </Button>
      </div>
    </div>
  );
};

export default SellerLogin;
