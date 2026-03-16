import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";

const AddressForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      address: "",
      pincode: "",
      city: "",
      state: "",
      locality: "",
    },
    onSubmit: (values) => {
      console.table(values);
      formik.resetForm();
    },
  });
  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <p className="text-xl font-bold text-center pb-5">Contact Details</p>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <TextField
            fullWidth
            type="text"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Enter your name.."
          />
          <TextField
            fullWidth
            type="text"
            name="address"
            label="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            placeholder="Enter your address.."
          />

          <TextField
            fullWidth
            type="tel"
            name="mobile"
            label="Phone Number"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            placeholder="Enter your phone number.."
          />
          <Grid className="gap-5 flex" xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              name="pincode"
              label="Pin Code"
              placeholder="Enter your pin code.."
            />
            <TextField
              fullWidth
              type="text"
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              placeholder="Enter your city.."
            />
          </Grid>
          <Grid className="gap-5 flex" xs={12} sm={6}>
            <TextField
              fullWidth
              type="text"
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              placeholder="Enter your state.."
            />
            <TextField
              fullWidth
              type="text"
              name="locality"
              label="Locality"
              value={formik.values.locality}
              onChange={formik.handleChange}
              placeholder="Enter your locality.."
            />
          </Grid>
          <Button onSubmit={AddressForm} variant="outlined" fullWidth>
            Submit
          </Button>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;
