import { lazy, Suspense } from "react";
const HomeCategoryTable = lazy(() => import("./HomeCategoryTable"));
import { homeCategoriesPriorityList } from "../../data/homeCategories";

const ShopByCategory = () => {
  const categories = homeCategoriesPriorityList
  return (
    <div className="w-full">
      <Suspense fallback={<h1>Loading...</h1>}>
        <HomeCategoryTable categories={categories} />
      </Suspense>
    </div>
  );
};

export default ShopByCategory;
