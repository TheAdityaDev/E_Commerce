
import HomeCategoryTable from './HomeCategoryTable'
import { useAppSelector } from '../../Redux Toolkit/store';

const ElectronicTable = () => {
  const homeCategories = useAppSelector(
    (store) => store.homeCategory?.homeCategories || [],
  );
  
  return (
    <div className="w-full">
      <HomeCategoryTable categories={homeCategories} />
    </div>
  )
}

export default ElectronicTable