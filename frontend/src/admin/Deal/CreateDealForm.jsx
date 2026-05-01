import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { createDeal } from "../../Redux Toolkit/Features/Admin/dealSlice";
import secureLocalStorage from "react-secure-storage";

const CreateDealForm = () => {
  const homeCategories = useAppSelector((store) => store?.homeCategory || []);
  const dispatch = useAppDispatch();
  const token = secureLocalStorage.getItem("token")
  console.log("Token:",token)
  const formik = useFormik({
    initialValues: {
      discount: "",
      category: "",
    },
    onSubmit: (values) => {
      const dealData = {
        discount: values.discount,
        categoryId: values.category,
      };
      dispatch(
        createDeal({
          token:token,
          deal: dealData,
        }),
      );
      formik.resetForm();
    },
  });
  return (
    <Box
      component={"form"}
      onSubmit={formik.handleSubmit}
      sx={{ width: 600, margin: "auto", padding: 3, maxWidth: "100%" }}
      className="space-y-6"
    >
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        Create New Deal
      </Typography>
      <div className="">
        <TextField
          fullWidth
          name="discount"
          label="Discount"
          value={formik.values.discount}
          onChange={formik.handleChange}
          type="number"
          inputMode="numeric"
          required
          enterKeyHint="next"
        />
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} className="mt-6">
          <FormControl fullWidth>
            <InputLabel id="category-label" required>
              Category
            </InputLabel>
            <Select
              id="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              labelId="category-label"
              name="category"
              label="Category"
              required
            >
              {homeCategories?.homeCategories?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </div>
      <div>
        <Button variant="outlined" type="submit" fullWidth sx={{ py: "11px" }}>
          Create Deal
        </Button>
      </div>
    </Box>
  );
};

export default CreateDealForm;
