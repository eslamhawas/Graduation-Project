
import Categories from "./Categories"
import ProductList from "./ProductList"
import Slider from "./Slider"
import Tag from "./Tag"
export default function Home() {


  return (
    <div>
    <Categories />
    <Slider />
    <Tag/>
    <ProductList type="bestSelling" />
    <Tag/>
    <ProductList type="allProducts" />
  </div>
  )
}