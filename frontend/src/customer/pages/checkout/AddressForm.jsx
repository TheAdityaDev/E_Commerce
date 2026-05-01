import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../Redux Toolkit/store";
import { createOrder } from "../../../Redux Toolkit/Features/Customer/orderSlice";
import secureLocalStorage from "react-secure-storage";

const AddressForm = ({ paymentGateway }) => {
  const [localities, setLocalities] = useState([]);
  const dispatch = useAppDispatch();
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
      dispatch(
        createOrder({
          address: values ,
          token: secureLocalStorage.getItem("token"),
          paymentGateway,
        }),
      );
      formik.resetForm();
    },
  });

  const fetchPincodeDetails = async (pincode) => {
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (res.status === 400) {
        fetchPincodeDetails(pincode)
      }

      if (data[0].Status === "Success") {
        const offices = data[0].PostOffice;

        setLocalities(offices); // store all options

        // optional: set default
        const first = offices[0];
        formik.setFieldValue("city", first.District);
        formik.setFieldValue("state", first.State);
        formik.setFieldValue("country", first.Country);
      }
    } catch (err) {
      console.log(err || "Error fetching pincode");
    }
  };
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
            inputMode="text"
            enterKeyHint="next"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Enter your name.."
            required
          />
          <TextField
            fullWidth
            type="text"
            name="address"
            label="Address"
            multiline
            rows={2}
            inputMode="text"
            enterKeyHint="next"
            value={formik.values.address}
            onChange={formik.handleChange}
            placeholder="Enter your address.."
            required
          />

          <TextField
            fullWidth
            type="tel"
            name="mobile"
            label="Phone Number"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            inputMode="tel"
            enterKeyHint="next"
            placeholder="Enter your phone number.."
            required
          />
          <Grid className="gap-5 flex" xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              value={formik.values.pincode}
              InputProps={{ inputProps: { maxLength: 6 } }}
              enterKeyHint="next"
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("pincode", value);

                if (value.length === 6) {
                  fetchPincodeDetails(value);
                }
              }}
              name="pincode"
              label="Pin Code"
              placeholder="Enter your pin code.."
              inputMode="numeric"
              required
            />
            <TextField
              fullWidth
              type="text"
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              placeholder="Enter your city.."
              inputMode="text"
              enterKeyHint="next"
              required
            />
          </Grid>
          <Grid className="gap-5 flex w-full" xs={12} sm={6}>
            <TextField
              type="text"
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              inputMode="text"
              enterKeyHint="next"
              placeholder="Enter your state.."
              required
            />
            <Grid>
              {/* <InputLabel>Locality</InputLabel> */}
              <Select
              className="w-52"
                label="Locality"
                name="locality"
                value={formik.values.locality || ""}
                onChange={(e) => {
                  const selected = localities.find(
                    (loc) => loc.Name === e.target.value,
                  );

                  if (selected) {
                    formik.setFieldValue("locality", selected.Name);
                    formik.setFieldValue("city", selected.District);
                    formik.setFieldValue("state", selected.State);
                    formik.setFieldValue("country", selected.Country);
                  }
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
          </Grid>
          <Button
          enterKeyHint="done"
          onSubmit={formik.handleSubmit } type="submit" variant="outlined" fullWidth>
            Submit
          </Button>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;
