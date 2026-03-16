import { Box, Grid, TextField } from "@mui/material";
import React from "react";

const SellerStep2 = ({ formik }) => {
  // fetch seller location
  const fetchLocation = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        formik.setFieldValue("pickupAddress.locality", postOffice.Name);
        formik.setFieldValue("pickupAddress.city", postOffice.District);
        formik.setFieldValue("pickupAddress.state", postOffice.State);
      }
    } catch (error) {
      console.error("Pincode fetch error:", error);
    }
  };
  return (
    <Box>
      <div className="p-5 space-y-5 md:p-5 lg:p-5">
        <Grid className="space-y-5" spacing={3}>
          <Grid>
            <TextField
              fullWidth
              type="text"
              inputMode="text"
              label="Name"
              enterKeyHint="send"
              name="pickupAddress.name"
              value={formik.values.pickupAddress.name}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupAddress?.name &&
                Boolean(formik.errors.pickupAddress?.name)
              }
              helperText={
                formik.touched.pickupAddress?.name &&
                formik.errors.pickupAddress?.name
              }
              required
            />
          </Grid>
          <Grid className="flex gap-4 items-center">
            <TextField
              fullWidth
              type="tel"
              label="Alternative Mobile"
              inputMode="tel"
              InputProps={{ inputProps: { maxLength: 10 } }}
              name="pickupAddress.mobile"
              value={formik.values.pickupAddress.mobile}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupAddress?.mobile &&
                Boolean(formik.errors.pickupAddress?.mobile)
              }
              helperText={
                formik.touched.pickupAddress?.mobile &&
                formik.errors.pickupAddress?.mobile
              }
            />
            <TextField
              fullWidth
              type="number"
              inputMode="numeric"
              label="Pin Code"
              // inputProps={{ maxLength:4}}
              InputProps={{ inputProps: { maxLength: 6 } }}
              enterKeyHint="next"
              name="pickupAddress.pincode"
              value={formik.values.pickupAddress.pincode}
              onChange={(e) => {
                const value = e.target.value;

                // update formik value
                formik.setFieldValue("pickupAddress.pincode", value);

                // detect 6 digit pincode
                const match = value.match(/^\d{6}$/);

                if (match) {
                  fetchLocation(match[0]);
                }
              }}
              error={
                formik.touched.pickupAddress?.pincode &&
                Boolean(formik.errors.pickupAddress?.pincode)
              }
              helperText={
                formik.touched.pickupAddress?.pincode &&
                formik.errors.pickupAddress?.pincode
              }
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              id="pickupAddress"
              type="text"
              label="Pickup Address"
              name="pickupAddress.address"
              value={formik.values.pickupAddress.address}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupAddress?.address &&
                Boolean(formik.errors.pickupAddress?.address)
              }
              helperText={
                formik.touched.pickupAddress?.address &&
                formik.errors.pickupAddress?.address
              }
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              inputMode="text"
              type="text"
              label="Locality"
              name="pickupAddress.locality"
              value={formik.values.pickupAddress.locality}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupAddress?.locality &&
                Boolean(formik.errors.pickupAddress?.locality)
              }
              helperText={
                formik.touched.pickupAddress?.locality &&
                formik.errors.pickupAddress?.locality
              }
              required
            />
          </Grid>
          <Grid className="flex gap-4 items-center">
            <TextField
              fullWidth
              type="text"
              label="City"
              inputMode="text"
              name="pickupAddress.city"
              value={formik.values.pickupAddress.city}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupAddress?.city &&
                Boolean(formik.errors.pickupAddress?.city)
              }
              helperText={
                formik.touched.pickupAddress?.city &&
                formik.errors.pickupAddress?.city
              }
              required
            />
            <TextField
              fullWidth
              id="pickupAddress"
              type="text"
              label="State"
              name="pickupAddress.state"
              value={formik.values.pickupAddress.state}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupAddress?.state &&
                Boolean(formik.errors.pickupAddress?.state)
              }
              helperText={
                formik.touched.pickupAddress?.state &&
                formik.errors.pickupAddress?.state
              }
              required
            />
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default SellerStep2;
