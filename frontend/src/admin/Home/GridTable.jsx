import React from 'react'
import HomeCategoryTable from './HomeCategoryTable'
import { useAppSelector } from '../../Redux Toolkit/store';

const GridTable = () => {
   const gridCategories = useAppSelector(
      (store) => store?.grid,
    );
  return (
    <div>
      <HomeCategoryTable categories={gridCategories} />
    </div>
  )
}

export default GridTable