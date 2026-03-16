import React from 'react'
import HomeCategoryTable from './HomeCategoryTable'

const image= 
  "https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?cs=srgb&dl=light-light-bulb-idea-577514.jpg&fm=jpg"

const ElectronicTable = () => {
  return (
    <div>
      <HomeCategoryTable category="electronic" image={image} />
    </div>
  )
}

export default ElectronicTable