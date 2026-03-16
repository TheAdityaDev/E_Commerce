import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FilterSection from "./FilterSection";
import Divider from "@mui/material/Divider";
import ProductCard from "./ProductCard";
import Pagination from "@mui/material/Pagination";
import {
  Drawer,
  IconButton,
} from "@mui/material";
import { ListFilterPlus, SlidersHorizontal } from "lucide-react";

const product = [
  {
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWMJNkEB86VUkY92qAQy0mkXo2N9ZUgIliw&s",
      "https://m.media-amazon.com/images/I/71VDIT0gCxL._SY625_.jpg",
      "https://www.shutterstock.com/image-photo/rome-march-2023-brand-new-600nw-2304690973.jpg",
      "https://m.media-amazon.com/images/I/71mNYql+wmL._SY625_.jpg",
    ],
    seller: {
      businessDetails: {
        businessName: "Pablo Cloth",
      },
    },
  },
];

const Products = () => {
  const [sort, setSort] = useState("");

  const [openDrawer, setOpenDrawer] = useState(false);


  const handleChange = (event) => {
    setSort(event.target.value);
  };
  return (
    <div className="-z-10 mt-10">
      <div>
        <h1 className="text-2xl text-center text-bold text-shadow-blue-400 pb-5">
          Women Sarees
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
                <MenuItem value={"price_low"}>Price: Low_To_High</MenuItem>
                <MenuItem value={"price_high"}>Price: High_To_Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-9 mt-4 object-cover">
            {[1, 1, 1, 1, 1].map((_, i) => (
              <div key={i}>
                <ProductCard item={product[0]} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-10">
            <Pagination count={20} variant="outlined" shape="rounded" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;
