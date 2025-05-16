
import Categories from "./Categories"
import ProductList from "./ProductList"
import Tag from "./Tag"
export default function Home() {


  return (
    <div>
    <Categories />
    <Tag/>
    <ProductList type="bestSelling" />
    <Tag/>
    <ProductList type="allProducts" />
  </div>
  )
}