import React, { useRef, useEffect } from "react";

const Grid = () => {
 

  const images = [
    {
      desktop:
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&auto=format&fit=crop&q=80",
      mobile:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrrvRWDpRts3ffsdJKXCCqzfSaLNGc2Bxc5g&s",
    },
    {
      desktop:
        "https://weaverstory.com/cdn/shop/articles/1_815a1a73-68b8-49af-997c-cc2c8066417a.png?v=1704353375",
      mobile:
        "https://images.unsplash.com/photo-1622185135505-2d795003994a?w=600",
    },
    {
      desktop:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-xfDsugBgHUwVQvWOTcHVLsHcHJy7txJxw&s",
      mobile:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    },
    {
      desktop:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
      mobile:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=60",
    },
    {
      desktop:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&auto=format&fit=crop&q=80",
      mobile:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=60",
    },
    {
      desktop:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&auto=format&fit=crop&q=80",
      mobile:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=60",
    },
  ];
  const scrollRef = useRef(null);

  // Auto-scroll for mobile/tablet
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const firstChild = container.firstElementChild;
      if (!firstChild) return;

      const itemWidth = firstChild.offsetWidth + 16; // 16px gap
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft + itemWidth >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 lg:px-8">
      
      {/* ---------------- Desktop Grid ---------------- */}
      <div className="hidden lg:grid gap-4 grid-cols-12 auto-rows-[150px]">
        
        <div className="col-span-3 row-span-4 rounded-lg overflow-hidden">
          <img
            src={images[0].desktop}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="col-span-4 row-span-2 rounded-lg overflow-hidden">
          <img
            src={images[1].desktop}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="col-span-2 row-span-2 rounded-lg overflow-hidden">
          <img
            src={images[2].desktop}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="col-span-3 row-span-4 rounded-lg overflow-hidden">
          <img
            src={images[3].desktop}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="col-span-2 row-span-2 rounded-lg overflow-hidden">
          <img
            src={images[4].desktop}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="col-span-4 row-span-2 rounded-lg overflow-hidden">
          <img
            src={images[5].desktop}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
      </div>

      {/* ---------------- Mobile / Tablet Slider ---------------- */}
      <div
        ref={scrollRef}
        className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4"
      >
        {images.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[85vw] sm:w-[70vw] aspect-[16/9] snap-start rounded-lg overflow-hidden md:w-[850px] xl:w-[500px]"
          >
            <img
              src={item.mobile}
              srcSet={`${item.mobile} 600w, ${item.mobile} 1200w`}
              sizes="(max-width: 768px) 85vw, 70vw"
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;