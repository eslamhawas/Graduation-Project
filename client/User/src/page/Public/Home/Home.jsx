<<<<<<< HEAD
=======

>>>>>>> 3befb8ebdacc5ac6db819ee9113137257477d3c0
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