import React, { useEffect, useState } from "react";
import DealTable from "./DealTable";
import DealCategoryTable from "./DealCategoryTable";
import CreateDealForm from "./createDealForm";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { getAllDeals } from "../../Redux Toolkit/Features/Admin/dealSlice";
import secureLocalStorage from "react-secure-storage";

const tabs = ["Deals", "Create Deal"]; //optional Categories
const Deal = ({categories}) => {
  const [activeTab, setActiveTab] = useState("Deals");
  const dispatch = useAppDispatch();

  const token = secureLocalStorage.getItem("token")
  useEffect(() => {
    // Pre-fetch deals to ensure state is populated and token is valid
    dispatch(getAllDeals(token));
  }, [dispatch]);

  return (
    <div>
      <div className="flex sm:flex-row text-nowrap gap-3 sm:gap-4 justify-end ">
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
          <DealTable />
        )
        // ) : activeTab === "Categories" ? (
        //   <DealCategoryTable categories={categories} />
        // )
        : (
          <div className="mt-5 border-t flex flex-col justify-center items-center h-[70vh]">
            <CreateDealForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Deal;
