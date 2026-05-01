import {lazy , Suspense} from 'react'
const HomeCategoryTable = lazy(()=>import('../Home/HomeCategoryTable'))

const DealCategoryTable = ({categories}) => {

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <HomeCategoryTable categories={categories} />
    </Suspense>
  )
}

export default DealCategoryTable