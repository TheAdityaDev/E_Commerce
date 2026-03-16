import { Box, TextField } from "@mui/material";

const SellerStep1 = ({ formik  }) => {
  return (
    <Box>
      <p className="text-xl font-bold text-center pb-9">Contact Details</p>
      <div className="p-5 space-y-5  md:p-5 lg:p-10">
        <div>
          <TextField
            fullWidth
            id="mobile"
            type="tel"
            label="Mobile"
            name="mobile"
            inputMode="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            placeholder="123-456-7890"
            InputProps={{ inputProps: { maxLength: 10 } }}
            required
            enterKeyHint="next"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
        </div>
        <div>
          <TextField
            fullWidth
            id="email"
            type="text"
            label="Email"
            name="email"
            enterKeyHint="next"
            InputProps={{ inputProps: { maxLength: 20 } }}
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </div>
        <div>
          <TextField
            fullWidth
            id="GSTIN"
            type="text"
            label="GSTIN"
            name="GSTIN"
            enterKeyHint="next"
            InputProps={{ inputProps: { maxLength: 12 } }}
            required
            value={formik.values.GSTIN?.toUpperCase()}
            onChange={formik.handleChange}
            error={formik.touched.GSTIN && Boolean(formik.errors.GSTIN)}
            helperText={formik.touched.GSTIN && formik.errors.GSTIN}
          />
        </div>
      </div>
    </Box>
  );
};

export default SellerStep1;
