import React, { useState } from "react";
import DealTable from "./DealTable";
import DealCategoryTable from "./DealCategoryTable";
import CreateDealForm from "./createDealForm";
import { Button } from "@mui/material";

const image =
  "https://media.istockphoto.com/id/973481674/photo/stylish-man-posing-on-grey-background.jpg?s=2048x2048&w=is&k=20&c=kd0X3EwcoMRCXtgyyVLmuMuWvZe5d7MewThg2ebgwW4=";

const tabs = ["Deals", "Categories", "Create Deal"];
const Deal = () => {
  const [activeTab, setActiveTab] = useState("Deals");
  return (
    <div>
      <div className="flex sm:flex-row text-nowrap gap-3 sm:gap-4 justify-end sm:justify-end ">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={tab === activeTab ? "contained" : "outlined"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="lg:mt-0 mt-10">
        {activeTab === "Deals" ? (
          <DealTable image={image} />
        ) : activeTab === "Categories" ? (
          <DealCategoryTable />
        ) : (
          <div className="mt-5 border-t flex flex-col justify-center items-center h-[70vh]">
            <CreateDealForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Deal;
