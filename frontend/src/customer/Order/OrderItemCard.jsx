import { Avatar } from "@mui/material";
import { ElectricBolt } from "@mui/icons-material";
import { logo } from "../json/common";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, CircleArrowRight } from "lucide-react";

const OrderItemCard = () => {
  const navigate = useNavigate();

  return (
    <div className="text-sm bg-white p-5 space-y-4 border rounded-md m-5">
      <div className="flex items-center gap-3">
        <div className="">
          <Avatar sizes="small" sx={{ bgcolor: "#00927c" }}>
            <ElectricBolt />
          </Avatar>
        </div>
        <div>
          <h1 className="font-bold text-teal-200">PENDING</h1>
          <p className="text-gray-700 italic hover:underline origin-left duration-500 ease-in-out hover:scale-110 ">
            Arriving date 12/12/2026
          </p>
        </div>
      </div>
      <div className="p-5 bg-teal-100 flex gap-5 items-center">
        <img
          className="h-17.5  w-17.5 object-cover rounded-md"
          src="https://media.istockphoto.com/id/1201024669/photo/handsome-man-in-casual-clothing.jpg?s=612x612&w=0&k=20&c=TexR7OTm-QRZCtkDecnSVgihtLMbG9WynadACrEiMf0="
          alt=""
        />
        <div className="w-full space-y-3">
          <h1>{logo.name}</h1>
          <p>White shirt with the logo</p>
          <p>
            <strong>Size:</strong> FREE
          </p>
        </div>
        <div
          onClick={() => navigate(`/account/orders/1/item/1`)}
          className="  text-white bg-gray-600/30 rounded-md hover:bg-gray-700/50 cursor-pointer"
        >
          <ChevronRightIcon className="size-8" />
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
