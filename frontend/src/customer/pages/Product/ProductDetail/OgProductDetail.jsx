import {lazy , Suspense} from 'react'
const ProductDetail = lazy(() => import("./ProductDetail"));

const OgProductDetail = () => {
  return (
    <Suspense fallback={<h1>Loading..</h1>}>
      <ProductDetail />
    </Suspense>
  )
}

export default OgProductDetail
