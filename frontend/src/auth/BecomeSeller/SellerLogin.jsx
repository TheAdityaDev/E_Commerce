import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useAppSelector } from "../../Redux Toolkit/store";

const SellerLogin = () => {

   const { auth } = useAppSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div className="mt-40">
      {" "}
      <p className="text-xl font-bold text-center pb-9">Contact Details</p>
      <div className="p-5 space-y-5  md:p-5 lg:p-10">
        <div>
          <TextField
            fullWidth
            id="email"
            type="email"
            label="Email"
            inputMode="email"
            name="email"
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
      </div>
      <div className="flex items-center justify-center mt-5">
        <Button variant="contained" type="submit" className="px-5 py-5">Login</Button>
      </div>
    </div>
  );
};

export default SellerLogin;
