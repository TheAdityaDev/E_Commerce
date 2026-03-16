import React, { useEffect, useMemo, useState } from "react";
import HomeCategoryCard from "./HomeCategoryCard";
import { LayoutGrid, Star } from "lucide-react";

const HomeCategory = () => {
  const STORAGE_KEY = "priority_categories_v1";

  const defaultCategories = [
    {
      id: 1,
      title: "Headphones",
      isStarred: false,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    },
    {
      id: 2,
      title: "Watches",
      isStarred: false,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    },
    {
      id: 3,
      title: "Laptops",
      isStarred: false,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    },
    {
      id: 4,
      title: "Cameras",
      isStarred: false,
      image:
        "https://images.unsplash.com/photo-1526170315870-ef6d82f583ad?w=400",
    },
    {
      id: 5,
      title: "Gaming",
      isStarred: false,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    },
    {
      id: 6,
      title: "Audio",
      isStarred: false,
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    },
    {
      id: 7,
      title: "Smart Home",
      isStarred: false,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400",
    },
    {
      id: 8,
      title: "Tablets",
      isStarred: false,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    },
  ];

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const starredIds = JSON.parse(saved);
        return defaultCategories.map((cat) => ({
          ...cat,
          isStarred: starredIds.includes(cat.id),
        }));
      }
    } catch (e) {
      console.error("Failed to load storage", e);
    }
    return defaultCategories;
  });

  useEffect(() => {
    const starredIds = categories
      .filter((cat) => cat.isStarred)
      .map((cat) => cat.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starredIds));
  }, [categories]);

  const handleToggleStar = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isStarred: !cat.isStarred } : cat,
      ),
    );
  };

  // Split categories into two "folders"
  const starredItems = useMemo(
    () => categories.filter((c) => c.isStarred),
    [categories],
  );
  const generalItems = useMemo(
    () => categories.filter((c) => !c.isStarred),
    [categories],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Explore Categories
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Star items to move them into your Priority Folder.
          </p>
        </header>

        {/* Folder 1: Priority Items */}
        {starredItems.length > 0 && (
          <section className="mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-yellow-200">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Priority List
                </h2>
                <p className="text-xs text-yellow-600 font-medium uppercase tracking-wider">
                  Pinned Folders
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 md:gap-8">
              {starredItems.map((category) => (
                <HomeCategoryCard
                  key={category.id}
                  category={category}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </div>
            {starredItems.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-200 text-center">
                    <button
                      onClick={() =>
                        setCategories(
                          categories.map((c) => ({ ...c, isStarred: false })
                        ),
                        localStorage.removeItem(STORAGE_KEY)
                        )
                      }
                      className="px-6 py-2 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border border-gray-200 hover:border-red-200 transition-all"
                    >
                      Clear Priority Folder
                    </button>
                  </div>
                )}
          </section>
        )}

        {/* Folder 2: General Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {starredItems.length > 0
                  ? "Other Categories"
                  : "All Categories"}
              </h2>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                General Explorer
              </p>
            </div>
          </div>

          {generalItems.length > 0 ? (
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 md:gap-8">
              {generalItems.map((category) => (
                <HomeCategoryCard
                  key={category.id}
                  category={category}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-400 italic">
                All items are currently in your Priority List.
              </p>
            </div>
          )}
        </section>

        {/* Global Reset Action */}
      </div>
    </div>
  );
};

export default HomeCategory;
