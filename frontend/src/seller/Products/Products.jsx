import React, { useEffect } from "react";
import ProductTable from "./ProductTable";
import { useAppDispatch } from "../../Redux Toolkit/store";
import { fetchSellerProduct } from "../../Redux Toolkit/Features/Seller/sellerProductSlice";
import secureLocalStorage from "react-secure-storage";

const Products = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    dispatch(fetchSellerProduct({token}));
  }, []);


  

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold italic">Products</h1>
      <ProductTable />
    </div>
  );
};

export default Products;
