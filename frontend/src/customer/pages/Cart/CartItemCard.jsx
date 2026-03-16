import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Minus, Plus, X } from "lucide-react";

const CartItemCard = () => {
  return (
    <div className="border border-gray-300 rounded-md relative">
      <div className="p-5 flex gap-3">
        <div className="">
          <img
          loading="lazy"
            className="w-45 rounded-md"
            src="https://m.media-amazon.com/images/I/71VDIT0gCxL._SY625_.jpg"
            alt=""
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-semibold text-lg">Ram Shop</h1>
          <h1>Adidas Shoes</h1>
          <p className="text-gray-500">Black Adidas Shoes</p>
          <p className="text-gray-600 text-xs">
            <strong>Sold by :</strong> Ram Shop
          </p>
          <p className="text-xs">
            <strong>7 days replacement</strong> available.
          </p>
          <p className="text-sm text-gray-500">
            <strong>quantity</strong>: 2
          </p>
        </div>
      </div>
      <Divider />
      <div className="px-5 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 justify-between w-35">
          <Button startIcon={<Minus className="text-xl ml-2"/>}  variant="outlined" size="small" />
          <span className="text-xl m-2">1</span>
          <Button startIcon={<Plus className="text-xl ml-2"/>}  variant="outlined" size="small"/>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-lg">$500</h1>
          {/* <Button variant="contained" color="error" size="small">
            <Trash2 className="text-white" />
          </Button> */}
        </div>
      </div>
      <div className="absolute top-1 right-1">
        <IconButton>
          <X className="text-gray-500" />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItemCard;
