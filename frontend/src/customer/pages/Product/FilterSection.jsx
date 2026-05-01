import { useState, useMemo, useEffect } from "react";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { useParams, useSearchParams } from "react-router-dom";
import { colors } from "../../../data/filter/color";
import { prices } from "../../../data/filter/price";
import { discount } from "../../../data/filter/discount";
import { useAppDispatch } from "../../../Redux Toolkit/store";
import { filterProducts } from "../../../Redux Toolkit/Features/Customer/productSlice";

const ITEMS_PER_LOAD = 20;

const FilterSection = () => {
  const dispatch = useAppDispatch();
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchParamString = searchParams.toString();
  const searchKeyword = searchParams.get("search") || "";

  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem("selectedColor") || "";
  });
  const [selectedPrice, setSelectedPrice] = useState(() => {
    return localStorage.getItem("selectedPrice") || "";
  });
  const [selectedDiscount, setSelectedDiscount] = useState(() => {
    return localStorage.getItem("selectedDiscount") || "";
  });
  const [selectedSize, setSelectedSize] = useState(() => {
    return localStorage.getItem("selectedSize") || "";
  });
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const shouldShowSizes = /men|women|kids/i.test(categoryId || "");
  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const filteredColors = useMemo(() => {
    return colors.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const visibleColors = filteredColors.slice(0, visibleCount);

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

  useEffect(() => {
    localStorage.setItem("selectedColor", selectedColor);
    localStorage.setItem("selectedPrice", selectedPrice);
    localStorage.setItem("selectedDiscount", selectedDiscount);
    localStorage.setItem("selectedSize", selectedSize);
  }, [selectedColor, selectedPrice, selectedDiscount, selectedSize]);

  useEffect(() => {
    // Find the price object to get min and max values
    const priceObject = prices.find((p) => p.name === selectedPrice);
    const discountObject = discount.find((d) => d.name === selectedDiscount);

    dispatch(
      filterProducts({
        category: categoryId,
        search: searchKeyword,
        color: selectedColor.toLocaleLowerCase(),
        size: shouldShowSizes ? selectedSize : "",
        minPrice: priceObject?.min,
        maxPrice: priceObject?.max,
        minDiscount: discountObject?.min,
      }),
    );
  }, [
    selectedColor,
    selectedPrice,
    selectedDiscount,
    selectedSize,
    categoryId,
    searchParamString,
    shouldShowSizes,
    dispatch,
  ]);

  return (
    <div className="space-y-5 sticky top-10 bg-white">
      <div className="flex items-center justify-between h-[40px] px-9 mt-5 lg:border-r lg:mt-0">
        <p className="text-lg font-semibold">Filter</p>
        <button
          onClick={() => {
            setSearch("");
            setSelectedColor("");
            setSelectedDiscount("");
            setSelectedPrice("");
            setSelectedSize("");
            setVisibleCount(ITEMS_PER_LOAD);

            localStorage.removeItem("selectedColor", "");
            localStorage.removeItem("selectedPrice", "");
            localStorage.removeItem("selectedDiscount", "");
            localStorage.removeItem("selectedSize", "");
          }}
          className="bg-green-700 px-2 py-1 text-white cursor-pointer rounded-md hover:bg-green-700 transition-all duration-300 md:bg-green-700/50"
        >
          Clear Filter
        </button>
      </div>

      <Divider />

      <div className="px-9 space-y-6">
        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "teal",
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Colors
              <span className="text-teal-400">{colors.length}+</span>
            </FormLabel>

            <TextField
              size="small"
              placeholder="Search color..."
              value={search}
              inputMode="search"
              enterKeyHint="search"
              about="Search"
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(ITEMS_PER_LOAD);
              }}
              sx={{ mt: 1, mb: 1 }}
            />

            {/* Scroll container OUTSIDE RadioGroup */}
            <div
              className="scrollable-container max-h-[250px] overflow-y-auto "
              onScroll={handleScroll}
            >
              <RadioGroup
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                }}
              >
                {visibleColors.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <FormControlLabel
                      value={item.name}
                      control={<Radio />}
                      label={item.name}
                    />
                    <span
                      style={{
                        height: 20,
                        width: 20,
                        background: item.hex,
                        right: 0,
                        borderRadius: "20%",
                      }}
                    />
                  </div>
                ))}
              </RadioGroup>

              {visibleColors.length < filteredColors.length && (
                <p className="text-center text-xs text-gray-400 py-2">
                  Loading more...
                </p>
              )}
            </div>
          </FormControl>
          <Divider />
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "teal",
                mt: 2,
              }}
            >
              Price
            </FormLabel>

            {/* Scroll container OUTSIDE RadioGroup */}

            <RadioGroup
              value={selectedPrice}
              onChange={(e) => {
                setSelectedPrice(e.target.value);
              }}
            >
              {prices.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio />}
                  label={item.name}
                  style={{ accentColor: item.hex }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Divider />
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "teal",
                mt: 2,
              }}
            >
              Discount
            </FormLabel>

            {/* Scroll container OUTSIDE RadioGroup */}

            <RadioGroup
              value={selectedDiscount}
              onChange={(e) => {
                setSelectedDiscount(e.target.value);
              }}
            >
              {discount.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {shouldShowSizes && (
            <>
              <Divider />
              <FormControl>
                <FormLabel
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "teal",
                    mt: 2,
                  }}
                >
                  Size
                </FormLabel>
                <RadioGroup
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <FormControlLabel
                    value={""}
                    control={<Radio />}
                    label={"All"}
                  />
                  {sizeOptions.map((s) => (
                    <FormControlLabel
                      key={s}
                      value={s}
                      control={<Radio />}
                      label={s}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
