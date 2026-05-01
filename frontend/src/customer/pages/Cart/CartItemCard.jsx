import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Minus, Plus, X } from "lucide-react";
import { logo } from "../../json/common";
import { useAppDispatch } from "../../../Redux Toolkit/store";
import {
  deleteCartItem,
  updateCartItem,
} from "../../../Redux Toolkit/Features/Customer/cartSlice";
import secureLocalStorage from "react-secure-storage";

const CartItemCard = ({ item }) => {
  const dispatch = useAppDispatch();

  const handelUpdateCartItem = (quantity) => {
    dispatch(
      updateCartItem({
        token: secureLocalStorage.getItem("token"),
        userId: item?.user?._id, // ✅ Correct user ID
        cartItemId: item?._id, // ✅ Cart item ID
        quantity,
      }),
    );
  };

  const handelDelete = () => {
    dispatch(
      deleteCartItem({
        token: secureLocalStorage.getItem("token"),
        cartItemId: item?._id,
      }),
    );
  };
  return (
    <div className="border border-gray-300 rounded-md relative overflow-hidden">
      <div className="p-5 flex gap-3">
        <div>
          <img
            loading="lazy"
            className="w-45 rounded-md"
            src={item.product?.images[0]}
            alt={item.product?.title}
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-semibold text-lg">{logo.name}</h1>
          <h1>{item?.product.title}</h1>
          <p className="text-gray-500 line-clamp-2">
            {item?.product?.description}
          </p>
          <p className="text-gray-600 text-xs flex items-center space-x-1 md:space-x-2">
            <strong className="whitespace-nowrap">Sold by:</strong>

            <span className="flex items-start space-x-1 truncate">
              <span className="truncate">
                {item?.product?.seller?.sellerName || "Seller Name"}
              </span>

              {item?.product?.seller && (
                <svg
                  className="w-3 h-3 sm:w-4 md:w-5 text-blue-500 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12s4.477 10 10 10 10-4.478 10-10zm-11 5l-5-5 1.414-1.414L11 14.172l6.586-6.586L19 9l-8 8z" />
                </svg>
              )}
            </span>
          </p>
          <p className="text-xs">
            <strong>7 days replacement</strong> available.
          </p>
          <p className="text-sm text-gray-500">
            <strong>quantity</strong>: {item?.quantity}
          </p>
        </div>
      </div>
      <Divider />
      <div className="px-5 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2 justify-between w-35">
          <Button
            disabled={item?.quantity === 1}
            onClick={() => handelUpdateCartItem(item.quantity - 1)}
            startIcon={<Minus className="text-xl ml-2" />}
            variant="outlined"
            size="small"
          />
          <span className="text-xl m-2">{item?.quantity}</span>
          <Button
            onClick={() => handelUpdateCartItem(item.quantity + 1)}
            startIcon={<Plus className="text-xl ml-2" />}
            variant="outlined"
            size="small"
          />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-lg">
            ₹{item?.product?.sellingPrice * item?.quantity}
          </h1>
          <h1 className="font-semibold text-gray-400 line-through text-2">
            ₹{item?.product?.mrpPrice}
          </h1>

          {/* <Button variant="contained" color="error" size="small">
            <Trash2 className="text-white" />
          </Button> */}
        </div>
      </div>
      <div className="absolute top-1 right-1">
        <IconButton onClick={handelDelete}>
          <X className="text-gray-500" />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItemCard;
