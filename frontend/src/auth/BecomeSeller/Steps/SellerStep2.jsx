import { Box, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";

const SellerStep2 = ({ formik }) => {
  const [localities, setLocalities] = useState([]);
  // fetch seller location
 const fetchPincodeDetails = async (pincode) => {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await res.json();

    if (data[0].Status === "Success") {
      const offices = data[0].PostOffice;

      setLocalities(offices); // store all options

      // optional: set default
      const first = offices[0];
      formik.setFieldValue("pickupDetails.city", first.District);
      formik.setFieldValue("pickupDetails.state", first.State);
      formik.setFieldValue("pickupDetails.country", first.Country);
    }
  } catch (err) {
    console.log(err||"Error fetching pincode");
  }
};
  return (
    <Box>
      <div className="p-5 space-y-5 md:p-5 lg:p-5">
        <Grid className="space-y-5" spacing={3}>
          <Grid className="flex gap-4 items-center">
            <TextField
              fullWidth
              type="number"
              inputMode="numeric"
              label="Pin Code"
              // inputProps={{ maxLength:4}}
              InputProps={{ inputProps: { maxLength: 6 } }}
              enterKeyHint="next"
              name="pickupDetails.pincode"
              value={formik.values.pickupDetails.pincode}
              onChange={(e) => {
                const value = e.target.value;

                // update formik value
                formik.setFieldValue("pickupDetails.pincode", value);

                // detect 6 digit pincode
                const match = value.match(/^\d{6}$/);

                if (match) {
                  fetchPincodeDetails(match[0]);
                }
              }}
              error={
                formik.touched.pickupDetails?.pincode &&
                Boolean(formik.errors.pickupDetails?.pincode)
              }
              helperText={
                formik.touched.pickupDetails?.pincode &&
                formik.errors.pickupDetails?.pincode
              }
              required
            />
            <TextField
              fullWidth
              id="country"
              type="text"
              label="Country"
              name="pickupDetails.country"
              value={formik.values.pickupDetails.country}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupDetails?.country &&
                Boolean(formik.errors.pickupDetails?.country)
              }
              helperText={
                formik.touched.pickupDetails?.country &&
                formik.errors.pickupDetails?.country
              }
              required
            />
          </Grid>
          <Grid className="flex gap-4 items-center">
            <TextField
              fullWidth
              type="text"
              label="Address"
              inputMode="text"
              InputProps={{ inputProps: { maxLength: 30 } }}
              name="pickupDetails.address"
              value={formik.values.pickupDetails.address}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupDetails?.address &&
                Boolean(formik.errors.pickupDetails?.address)
              }
              helperText={
                formik.touched.pickupDetails?.address &&
                formik.errors.pickupDetails?.address
              }
              required
            />
          </Grid>

          <Grid>
            <InputLabel>Locality</InputLabel>
            <Select
            fullWidth
              name="pickupDetails.locality"
              value={formik.values.pickupDetails.locality || ""}
              onChange={(e) => {
                const selected = localities.find(
                  (loc) => loc.Name === e.target.value,
                );

                formik.setFieldValue("pickupDetails.locality", selected.Name);
                formik.setFieldValue("pickupDetails.city", selected.District);
                formik.setFieldValue("pickupDetails.state", selected.State);
                formik.setFieldValue("pickupDetails.country", selected.Country);
              }}
              required
            >
              {localities.map((loc, index) => (
                <MenuItem key={index} value={loc.Name}>
                  {loc.Name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid className="flex gap-4 items-center">
            <TextField
              fullWidth
              type="text"
              label="City"
              inputMode="text"
              name="pickupDetails.city"
              value={formik.values.pickupDetails.city}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupDetails?.city &&
                Boolean(formik.errors.pickupDetails?.city)
              }
              helperText={
                formik.touched.pickupDetails?.city &&
                formik.errors.pickupDetails?.city
              }
              required
            />
            <TextField
              fullWidth
              id="pickupDetails"
              type="text"
              label="State"
              name="pickupDetails.state"
              value={formik.values.pickupDetails.state}
              onChange={formik.handleChange}
              error={
                formik.touched.pickupDetails?.state &&
                Boolean(formik.errors.pickupDetails?.state)
              }
              helperText={
                formik.touched.pickupDetails?.state &&
                formik.errors.pickupDetails?.state
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
