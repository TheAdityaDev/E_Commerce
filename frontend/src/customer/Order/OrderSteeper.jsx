import { FiberManualRecord } from "@mui/icons-material";
import { Box } from "@mui/material";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    name: "Pending Order",
    description: "Your order is being prepared",
    value: "PENDING",
  },
  {
    name: "Order Placed",
    description: "Order confirmed successfully",
    value: "PLACED",
  },
  {
    name: "Packed",
    description: "Item packed at warehouse",
    value: "CONFIRMED",
  },
  {
    name: "Shipped",
    description: "Out for delivery",
    value: "SHIPPED",
  },
  {
    name: "Arriving",
    description: "Almost there",
    value: "ARRIVING",
  },
  {
    name: "Delivered",
    description: "Package delivered",
    value: "DELIVERED",
  },
];

const cancelStep = [
  {
    name: "Order Placed",
    description: "Order was placed",
    value: "PLACED",
  },
  {
    name: "Order Cancelled",
    description: "Order has been cancelled",
    value: "CANCELLED",
  },
];

const OrderSteeper = ({ orderStatus }) => {
  // ✅ Normalize status (fix backend mismatch issue)
  const normalizedStatus = orderStatus?.toUpperCase();

  // ✅ Choose steps dynamically
  const statusStep =
    normalizedStatus === "CANCELLED" ? cancelStep : steps;

  // ✅ Find current step index safely
  const currentStepIndex = statusStep.findIndex(
    (step) => step.value === normalizedStatus
  );

  // ✅ Fallback if not found
  const safeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <Box className="mx-auto my-10 max-w-md">
      {statusStep.map((step, index) => {
        const isActive = index === safeIndex;
        const isCompleted = index < safeIndex;

        return (
          <div key={index} className="flex p-2 transition-all duration-300">
            {/* LEFT SIDE (ICON + LINE) */}
            <div className="flex flex-col items-center">
              <Box
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${
                  isCompleted || isActive
                    ? normalizedStatus === "CANCELLED" &&
                      step.value === "CANCELLED"
                      ? "bg-red-500"
                      : "bg-teal-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {isActive ? (
                  <CheckCircle className="size-5 text-white" />
                ) : (
                  <FiberManualRecord
                    className={`size-4 ${
                      isCompleted ? "text-white" : "text-gray-500"
                    }`}
                  />
                )}
              </Box>

              {/* LINE */}
              {index < statusStep.length - 1 && (
                <div
                  className={`h-20 w-0.5 transition-all duration-300 ${
                    isCompleted
                      ? normalizedStatus === "CANCELLED"
                        ? "bg-red-500"
                        : "bg-teal-500"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>

            {/* RIGHT SIDE (TEXT) */}
            <div className="ml-3 w-full">
              <div
                className={`transition-all duration-300 ${
                  isActive
                    ? "p-2 font-semibold rounded-md -translate-y-2 shadow-sm"
                    : ""
                } ${
                  normalizedStatus === "CANCELLED" &&
                  step.value === "CANCELLED"
                    ? "bg-red-500 text-white"
                    : ""
                }`}
              >
                <p>{step.name}</p>
                <p
                  className={`text-sm ${
                    isActive
                      ? normalizedStatus === "CANCELLED"
                        ? "text-white"
                        : "text-gray-200"
                      : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Box>
  );
};

export default OrderSteeper;