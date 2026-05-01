import React, { useEffect, useMemo, useRef } from "react";
import ProductCard from "../ProductCard";
import { useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { getAllProducts } from "../../../../Redux Toolkit/Features/Customer/productSlice";

const SimilarProduct = () => {
  const { productId, categoryId } = useParams();
  const dispatch = useAppDispatch();
  const lastRequestedKeyRef = useRef("");

  const { products, loading } = useAppSelector((state) => state.products);

  // Fetch after global loading settles, then run once per product/category key.
  useEffect(() => {
    if (!categoryId || loading) return;

    const requestKey = `${categoryId}:${productId}`;
    if (lastRequestedKeyRef.current === requestKey) return;

    lastRequestedKeyRef.current = requestKey;

    dispatch(
      getAllProducts({
        category: categoryId,
        pageNumber: 1,
      }),
    );
  }, [dispatch, categoryId, productId, loading]);

  // ✅ filter similar products
  const similarProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products
      .filter((item) => item?._id !== productId)
      .slice(0, 8);
  }, [products, productId]);

  // loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <CircularProgress />
      </div>
    );
  }

  // empty state
  if (!similarProducts.length) {
    return (
      <Typography className="text-center py-10 text-gray-500">
        No similar products found
      </Typography>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
      {similarProducts.map((item) => (
        <ProductCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default SimilarProduct;