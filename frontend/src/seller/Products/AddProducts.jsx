import { useState, useMemo } from "react";
import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  AddCircleOutline,
  AddPhotoAlternate,
  Close,
} from "@mui/icons-material";
import { colors } from "../../data/filter/color";
import { mainCategory } from "../../data/category/mainCategory";
import { menLevelTwo } from "../../data/category/level2/menLevelTwo";
import { womenLevelTwo } from "../../data/category/level2/womenLevelTwo";
import { electronicsLevelTwo } from "../../data/category/level2/electronicsLevelTwo";
import { homeFurnitureLevelTwo } from "../../data/category/level2/homeFurnitureLevelTwo";
import { electronicsLevelThree } from "../../data/category/Level3/electronicsLevelThree";
import { homeFurnitureLevelThree } from "../../data/category/Level3/homeFurnitureLevelThree";
import { menLevelThree } from "../../data/category/Level3/menLevelThree";
import { womenLevelThree } from "../../data/category/Level3/womenLevelThree";
import { uploadToCloudinary } from "../../util/uploadToCloudinary";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { createProduct } from "../../Redux Toolkit/Features/Seller/sellerProductSlice";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

const categoryTwo = {
  men: menLevelTwo,
  women: womenLevelTwo,
  kids: [],
  electronics: electronicsLevelTwo,
  home_furniture: homeFurnitureLevelTwo,
  beauty: [],
};

const categoryThree = {
  men: menLevelThree,
  women: womenLevelThree,
  kids: [],
  electronics: electronicsLevelThree,
  home_furniture: homeFurnitureLevelThree,
  beauty: [],
};

const ITEMS_PER_LOAD = 20;

const AddProducts = () => {
  const dispatch = useAppDispatch();
  const [uploadImage, setUploadImage] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const initialValues = {
    title: "",
    description: "",
    mrpPrice: "",
    sellingPrice: "",
    quantity: "",
    color: "",
    images: [],
    category: "",
    category2: "",
    category3: "",
    size: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const token = secureLocalStorage.getItem("token");

      await dispatch(createProduct({ token, request: values }));
      // Reset form after successful submission
      formik.resetForm();
    },
  });

  const filteredColors = useMemo(() => colors, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      visibleCount < filteredColors.length
    ) {
      setVisibleCount((prev) =>
        Math.min(prev + ITEMS_PER_LOAD, filteredColors.length),
      );
    }
  };

  const handelImageChange = async (e) => {
    const limit = 5;
    if (formik.values.images.length >= limit) {
      toast.warn(`You can only upload up to ${limit} images.`);
      setUploadImage(false);
      return;
    }
    const file = e.target.files[0];

    setUploadImage(true);

    const image = await uploadToCloudinary(file);

    formik.values.images.push(image);
    formik.setFieldValue("images", formik.values.images);
    setUploadImage(false);
  };

  const handelRemove = (i) => {
    formik.values.images.splice(i, 1);
    formik.setFieldValue("images", formik.values.images);
  };

  const sizes = ["FREE", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  const childCategory = (categoriesOrMap = [], parentCategoryId) => {
    if (!categoriesOrMap) return [];
    if (Array.isArray(categoriesOrMap)) {
      return categoriesOrMap.filter(
        (child) => child.parentCategoryId === parentCategoryId,
      );
    }
    // categoriesOrMap is an object mapping level2 ids to arrays
    return categoriesOrMap[parentCategoryId] || [];
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <h1 className="text-xl font-bold pb-5 italic">Add Product</h1>
        <Grid container spacing={2}>
          <Grid className="flex flex-wrap gap-4" size={{ xs: 12 }}>
            <input
              type="file"
              accept="image/*"
              name=""
              id="fileInput"
              style={{ display: "none" }}
              onChange={handelImageChange}
              disabled={uploadImage}
            />
            <label htmlFor="fileInput" className="relative">
              <span className="h-24 w-24 flex items-center justify-center border border-gray-500 p-3 rounded-md cursor-pointer hover:bg-gray-300">
                <AddPhotoAlternate className=" text-gray-700" />
              </span>
              {uploadImage && (
                <span className="absolute h-24 w-24 cursor-not-allowed  flex items-center justify-center left-0 right-0 top-0 bottom-0">
                  <CircularProgress />
                </span>
              )}
            </label>

            <div className="flex flex-wrap gap-4">
              {formik.values.images.map((image, i) => (
                <div className="relative" key={i}>
                  <img
                    loading="lazy"
                    src={image}
                    alt=""
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <IconButton
                    onClick={() => handelRemove(i)}
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <Close sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Product Name"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Product Description"
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              label="MRP Price"
              id="mrp_price"
              name="mrpPrice"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              label="Selling Price"
              id="selling_price"
              name="sellingPrice"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                id="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                labelId="color-label"
                name="color"
                label="Color"
                required
                MenuProps={{
                  PaperProps: { style: { maxHeight: 220, overflow: "auto" } },
                  MenuListProps: { onScroll: handleScroll },
                }}
              >
                <MenuItem value="none">none</MenuItem>
                {filteredColors.slice(0, visibleCount).map((color, index) => (
                  <MenuItem
                    className="gap-5 flex items-center justify-center"
                    key={index}
                    value={color.name}
                  >
                    <span
                      style={{
                        height: 20,
                        width: 20,
                        background: color.hex,
                        borderRadius: 5,
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: 10,
                        marginRight: 8,
                        border: "1px solid #ddd",
                      }}
                      className="flex items-center justify-center"
                    />
                    {color.name}
                  </MenuItem>
                ))}
                {visibleCount < filteredColors.length && (
                  <MenuItem disabled>
                    <em>Scroll to load more...</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="size-label" required>
                Size
              </InputLabel>
              <Select
                id="size"
                value={formik.values.size}
                onChange={formik.handleChange}
                labelId="sizes-label"
                name="size"
                label="Size"
                required
              >
                {sizes.map((size, index) => (
                  <MenuItem key={index} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
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
                {mainCategory.map((item, i) => (
                  <MenuItem key={i} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="category2-label" required>
                Second Category
              </InputLabel>
              <Select
                id="category2"
                value={formik.values.category2}
                onChange={formik.handleChange}
                labelId="category2-label"
                name="category2"
                label="Second Category"
                required
              >
                {formik.values.category &&
                  categoryTwo[formik.values.category]?.map((item, i) => (
                    <MenuItem key={i} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="category3-label" required>
                Third Category
              </InputLabel>
              <Select
                id="category3"
                value={formik.values.category3}
                onChange={formik.handleChange}
                labelId="category3-label"
                name="category3"
                label="Third Category"
                required
              >
                {formik.values.category2 &&
                  childCategory(
                    categoryThree[formik.values.category],
                    formik.values.category2,
                  ).map((item, i) => (
                    <MenuItem key={i} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <TextField
            fullWidth
            type="number"
            inputMode="numeric"
            label="Quantity"
            id="quantity"
            name="quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            required
          />
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, lg: 4 }}
          className="flex justify-end mt-5 p-10"
        >
          <Button
            fullWidth
            variant="outlined"
            color="success"
            type="submit"
            className="flex items-center gap-1"
          >
            <AddCircleOutline />
            Add Product
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default AddProducts;
