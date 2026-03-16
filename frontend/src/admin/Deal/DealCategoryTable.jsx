import React from 'react'
import HomeCategoryTable from '../Home/HomeCategoryTable'
const image = "https://images.unsplash.com/photo-1536303158031-c868b371399f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFsZSUyMG1vZGVsfGVufDB8fDB8fHww"
const DealCategoryTable = () => {
  return (
    <div>
      <HomeCategoryTable image={image} />
    </div>
  )
}

export default DealCategoryTable