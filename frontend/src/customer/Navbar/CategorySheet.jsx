import { Box } from "@mui/material";
import { menLevelTwo } from "../../data/category/level2/menLevelTwo";
import { womenLevelTwo } from "../../data/category/level2/womenLevelTwo";
import { electronicsLevelTwo } from "../../data/category/level2/electronicsLevelTwo";
import { homeFurnitureLevelTwo } from "../../data/category/level2/homeFurnitureLevelTwo";
import { menLevelThree } from "../../data/category/Level3/menLevelThree";
import { womenLevelThree } from "../../data/category/Level3/womenLevelThree";
import { electronicsLevelThree } from "../../data/category/Level3/electronicsLevelThree";
import { homeFurnitureLevelThree } from "../../data/category/Level3/homeFurnitureLevelThree";
import { useNavigate } from "react-router-dom";

const categoryTwo = {
  men: menLevelTwo,
  women: womenLevelTwo,
  electronics: electronicsLevelTwo,
  home_furniture: homeFurnitureLevelTwo,
};

const categoryThree = {
  men: menLevelThree,
  women: womenLevelThree,
  electronics: electronicsLevelThree,
  home_furniture: homeFurnitureLevelThree,
};


const CategorySheet = ({ selectCategory, toogleDrawer, setShowSheet }) => {

const childCategory = (categoriesObj, parentCategoryId) => {
  return categoriesObj[parentCategoryId] || [];
};


const navigate = useNavigate()



  return (
    <Box className="bg-white shadow-lg lg:h-[500px] overflow-auto z-50 p-6 rounded-b-md duration-300 ease-in-out scroll-smooth">
      <div className="flex text-sm flex-wrap">
        {categoryTwo[selectCategory]?.map((item, index) => (
          <div
            key={item.name}
            className={`p-8 lg:w-[20%] ${index % 2 === 0 ? "bg-gray-100" : ""} text-teal-400`}
          >
            <p className=" text-teal-400 font-medium">{item.name}</p>
            <ul>
             {
              childCategory(categoryThree[selectCategory] , item.categoryId)?.map((item) =>(
                <div className="mt-2" key={item.name}>
                <li onClick={()=>navigate(`/products/${item.name.toLowerCase()}`)} className="cursor-pointer p-2 text-gray-400">{item.name}</li>
                </div>
              ))
             }
            </ul>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default CategorySheet;
