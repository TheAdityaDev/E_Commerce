import React, { lazy, Suspense, useEffect, useState, useMemo } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import { Drawer, IconButton } from "@mui/material";
import { SlidersHorizontal } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { getAllProducts } from "../../../Redux Toolkit/Features/Customer/productSlice";
import { notFoundImage } from "../../json/common";
const ProductCard = lazy(() => import("./ProductCard"));
const FilterSection = lazy(() => import("./FilterSection"));

const Products = () => {
  const [sort, setSort] = useState("");
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchParamString = searchParams.toString();
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortParam = searchParams.get("sort") || "";
  const page = searchParams.get("page") || 1;

  const dispatch = useAppDispatch();

  const [openDrawer, setOpenDrawer] = useState(false);
  const { products, loading } = useAppSelector((store) => store.products);

  const filterOptions = useMemo(() => ({
    category: categoryId,
    search,
    minPrice,
    maxPrice,
    sort: sortParam,
    pageNumber: page,
  }), [categoryId, search, minPrice, maxPrice, sortParam, page]);

  useEffect(() => {
    // Only fetch if products are empty or if the filter string has changed
    // This prevents re-fetching when navigating back if the data is already present
    const shouldFetch = products.length === 0 || searchParamString;
    
    if (shouldFetch) {
      dispatch(getAllProducts(filterOptions));
    }
  }, [dispatch, filterOptions, searchParamString]);

  const handleChange = (event) => {
    setSort(event.target.value);
    dispatch(
      getAllProducts({
        category: categoryId,
        search,
        minPrice,
        maxPrice,
        sort: event.target.value,
        pageNumber: page,
      }),
    );
  };
  return (
    <div className="-z-10 mt-10">
      <div>
        <h1 className="text-2xl text-center text-bold text-shadow-blue-400 pb-5">
          {/* {item.title} */}
        </h1>
      </div>

      <div className="lg:flex">
        <section className="hidden lg:block w-[20%] min-h-screen">
          <FilterSection />
        </section>
        <section className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-5 h-[40px]">
            <span className="flex justify-start items-start gap-2 lg:hidden">
              <IconButton onClick={() => setOpenDrawer(true)}>
                <SlidersHorizontal />
              </IconButton>
              <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
              >
                <FilterSection />
              </Drawer>
            </span>
            <FormControl className="w-[200px] lg:w-[250px]">
              <InputLabel id="demo-simple-select-label">
                Filter By Price
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                label="Sort"
                onChange={handleChange}
              >
                <MenuItem value={""}>All</MenuItem>
                <MenuItem value={"price_low"}>Price: Low_To_High</MenuItem>
                <MenuItem value={"price_high"}>Price: High_To_Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-[200px]">
                Loading...
              </div>
            }
          >
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-9 mt-4 object-cover">
              {loading && products.length === 0 ? (
                <div className="flex justify-center items-center col-span-full h-[200px]">
                  Loading...
                </div>
              ) : Array.isArray(products) && products.length > 0 ? (
                products.map((item) => (
                  <div key={item._id}>
                    <ProductCard item={item} />
                  </div>
                ))
              ) : !loading ? (
                <span className="flex flex-col items-center justify-center col-span-full py-10">
                  <img
                    className="h-100 w-100"
                    src={notFoundImage.image}
                    alt=""
                  />
                  <p>No products found</p>
                </span>
              ) : null}
            </div>
          </Suspense>
          <div className="flex justify-center mb-10">
            <Pagination count={20} variant="outlined" shape="rounded" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;
