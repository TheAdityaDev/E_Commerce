import { CheckCircle, FiberManualRecord } from "@mui/icons-material";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

const steps = [
  { name: "Order Placed", description: "on Thursday, 11 Aug", value: "PLACED" },
  {
    name: "Packed",
    description: "Item packed in Dispatched Warehouse",
    value: "CONFIRMED",
  },
  { name: "Shipped", description: "by Monday, 18 Aug", value: "SHIPPED" },
  {
    name: "Arriving",
    description: "Monday, 18 Aug - 23 Aug",
    value: "ARRIVING",
  },
  {
    name: "Arrived",
    description: "Monday, 11 Aug - 23 Aug",
    value: "DELIVERED",
  },
];

const cancelStep = [
  { name: "Order Placed", description: "on Thursday, 11 Aug", value: "PLACED" },
  {
    name: "Order Canceled",
    description: "on Thursday, 11 Aug",
    value: "CANCELLED",
  },
];

const currentStep = 2;
const OrderSteeper = ({ orderStatus }) => {
  const [statusStep, setStatusStep] = useState(steps);

  useEffect(() => {
    if (orderStatus === "CANCELLED") {
      setStatusStep(cancelStep);
    } else {
      setStatusStep(steps);
    }
  }, [orderStatus]);
  return (
    <Box className="mx-auto my-10">
      {statusStep.map((step, index) => (
        <>
          <div key={index} className={`flex p-.5`}>
            <div className="flex flex-col items-center">
              <Box
                sx={{ zIndex: -1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? "bg-gray-300 text-teal-400"
                    : "bg-gray-300 to-gray-600"
                }`}
              >
                {step.value === orderStatus ? (
                  <CheckCircle className="size-3 text-white" />
                ) : (
                  <FiberManualRecord sx={{ zIndex: -1 }} />
                )}
              </Box>
              {index < statusStep.length - 1 && (
                <div
                  className={`border h-20 w-0.5 ${index < currentStep ? "bg-teal-500" : "bg-gray-300 text-gray-600"}`}
                ></div>
              )}
            </div>
            <div className={`ml-2 w-full`}>
              <div
                className={`${
                  step.value === orderStatus
                    ? "p-2  font-medium rounded-md -translate-y-3"
                    : ""
                } ${orderStatus === "CANCELLED" && step.value === "CANCELLED" ? "bg-red-500 text-white" : ""}`}
              >
                <p>{step.name}</p>
                <p
                  className={`${step.value === orderStatus ? "text-gray-200" : "text-gray-500"}`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        </>
      ))}
    </Box>
  );
};

export default OrderSteeper;
