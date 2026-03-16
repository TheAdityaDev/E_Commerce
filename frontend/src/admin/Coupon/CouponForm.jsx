import React, { useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { Add } from "@mui/icons-material";
/* ---------------- Random Code Generator ---------------- */

function generateRandomKeyword(length = 12) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*";

  const allChars = lowercase + uppercase + numbers + special;

  let couponCode = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  for (let i = couponCode.length; i < length; i++) {
    couponCode.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  return couponCode.sort(() => Math.random() - 0.5).join("");
}

/* ---------------- Component ---------------- */

const CouponForm = () => {
  const formik = useFormik({
    initialValues: {
      code: "",
      discountPercentage: 0,
      validityStartDate: null,
      validityExpireDate: null,
      minimumValue: 0,
      validDays: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    const start = formik.values.validityStartDate;
    const end = formik.values.validityExpireDate;

    if (start && end) {
      const difference = end.diff(start, "day");

      formik.setFieldValue("validDays", difference >= 0 ? difference : 0);
    } else {
      formik.setFieldValue("validDays", "");
    }
  }, [formik.values.validityStartDate, formik.values.validityExpireDate]);

  const handleGenerateCode = () => {
    const newCode = generateRandomKeyword(14);
    formik.setFieldValue("code", newCode);
  };

  return (
    <main classNameName="max-w-3xl flex justify-self-center items-center rounded-full lg:mt-10">
      <section classNameName="w-full max-w-3xl">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
          <header classNameName="mb-6">
            <Typography variant="h5" fontWeight="bold" className="pb-5">
              Create Coupon
            </Typography>
          </header>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Coupon Code */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                  label="Code"
                  inputMode="text"
                  autoComplete="off"
                  enterKeyHint="next"
                  onCopy={(e) => e.preventDefault()}
                  type="text"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleGenerateCode}
                          edge="end"
                          aria-label="generate coupon code"
                        >
                          <AutoFixHighIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                  id="Code"
                />
              </Grid>

              {/* Discount Percentage */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="discountPercentage"
                  value={formik.values.discountPercentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.discountPercentage &&
                    Boolean(formik.errors.discountPercentage)
                  }
                  helperText={
                    formik.touched.discountPercentage &&
                    formik.errors.discountPercentage
                  }
                  label="Discount Percentage"
                  type="number"
                  enterKeyHint="go"
                  inputMode="numeric"
                  required
                />
              </Grid>
              {/* Coupon Date Start */}
              <Grid size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Coupon Start Date"
                    value={formik.values.validityStartDate}
                    onChange={(value) =>
                      formik.setFieldValue("validityStartDate", value)
                    }
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              {/* Coupon End */}
              <Grid size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Coupon Expire Date"
                    value={formik.values.validityExpireDate}
                    onChange={(value) =>
                      formik.setFieldValue("validityExpireDate", value)
                    }
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Submit Button */}
            </Grid>
            {/* Minimum Value */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                sx={{ mt: 5 }}
                fullWidth
                name="minimumValue"
                value={formik.values.minimumValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.minimumValue &&
                  Boolean(formik.errors.minimumValue)
                }
                helperText={
                  formik.touched.minimumValue && formik.errors.minimumValue
                }
                label="Minimum Value"
                type="number"
                enterKeyHint="go"
                inputMode="numeric"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                sx={{ mt: 2 }}
                fullWidth
                disabled
                label="Valid For (Days)"
                value={formik.values.validDays}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                startIcon={<Add />}
                fullWidth
                color="success"
                variant="contained"
                size="large"
                type="submit"
                sx={{ mt: 2 }}
              >
                Create Coupon
              </Button>
            </Grid>
          </Box>
        </Paper>
      </section>
    </main>
  );
};

export default CouponForm;
