import React from "react";
import ProductCard from "../ProductCard";

const product = [
  {
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWMJNkEB86VUkY92qAQy0mkXo2N9ZUgIliw&s",
      "https://m.media-amazon.com/images/I/71VDIT0gCxL._SY625_.jpg",
      "https://www.shutterstock.com/image-photo/rome-march-2023-brand-new-600nw-2304690973.jpg",
      "https://m.media-amazon.com/images/I/71mNYql+wmL._SY625_.jpg",
    ],
    seller: {
      businessDetails: {
        businessName: "Pablo Cloth",
      },
    },
  },
];

const SimilarProduct = () => {
  return (
    <div className="grid  lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 justify-between gap-4 gap-y-8">
      {[1, 1, 1, 1, 1, 1,].map((item) => (
        <ProductCard item={product[0]} />
      ))}
    </div>
  );
};

export default SimilarProduct;
