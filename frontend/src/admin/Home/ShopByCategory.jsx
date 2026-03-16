import React from 'react'
import HomeCategoryTable from './HomeCategoryTable'

const image = "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg"
const ShopByCategory = () => {
  return (
    <div>
      <HomeCategoryTable image={image} />
    </div>
  )
}

export default ShopByCategory