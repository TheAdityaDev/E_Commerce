import React, { useEffect, useState, useMemo } from "react";
import HomeCategoryCard from "./HomeCategoryCard";
import { LayoutGrid, Star } from "lucide-react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { homeCategoriesPriorityList } from "../../../../data/homeCategories";
import { useAppSelector } from "../../../../Redux Toolkit/store";

const STORAGE_KEY = "priority_categories_v1";

const HomeCategory = () => {
  // Fetch categories from Redux
const reduxCategories = useAppSelector(
  (store) => store.homeCategory?.homeCategories?.homeCategoriesPriorityList
);

const [categories, setCategories] = useState(() => {
  const initialCategories = reduxCategories?.length
    ? reduxCategories
    : homeCategoriesPriorityList || [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const starredIds = JSON.parse(saved);
      return initialCategories.map((cat) => ({
        ...cat,
        isStarred: starredIds.includes(cat.categoryId),
      }));
    }
  } catch (e) {
    toast.error("Something went wrong. Please try again later.", 
      <button type="button" onClick={window.location.reload()}>Refresh</button>
    )
  }

  return initialCategories.map((cat) => ({ ...cat, isStarred: false }));
});


  // Save starred IDs to localStorage
  useEffect(() => {
    if (!Array.isArray(categories)) return;
    const starredIds = categories.filter((c) => c?.isStarred).map((c) => c.categoryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starredIds));
  }, [categories]);

  // Toggle star (with secure token/role check)
  const handleToggleStar = (id) => {
    const token = secureLocalStorage.getItem("token");
    const role = secureLocalStorage.getItem("role");

    if (!token || role !== "customer") {
      toast.warn("Please login to set your priority list");
      return;
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.categoryId === id ? { ...c, isStarred: !c.isStarred } : c
      )
    );
  };

  // Memoize starred and general items
  const starredItems = useMemo(
    () => categories.filter((c) => c?.isStarred),
    [categories]
  );
  const generalItems = useMemo(
    () => categories.filter((c) => !c?.isStarred),
    [categories]
  );

  // Clear all priority stars
  const clearAll = () => {
    setCategories((prev) => prev.map((c) => ({ ...c, isStarred: false })));
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Explore Categories
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Star items to move them into your Priority Folder.
          </p>
        </header>

        {/* Priority Folder */}
        {starredItems.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-yellow-200">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Star size={20} fill="currentColor" />
              </div>
              <div className="w-full flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Priority List
                </h2>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 border rounded hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-6 md:gap-8">
              {starredItems.map((category) => (
                <HomeCategoryCard
                  key={category.categoryId}
                  category={category}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </div>
          </section>
        )}

        {/* General Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {starredItems.length > 0 ? "Other Categories" : "All Categories"}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-6 md:gap-8">
            {generalItems.map((category) => (
              <HomeCategoryCard
                
                key={category.categoryId}
                category={category}
                onToggleStar={handleToggleStar}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeCategory;