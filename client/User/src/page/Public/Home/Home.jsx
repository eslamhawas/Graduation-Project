
<<<<<<< HEAD


=======
import Categories from "./Categories"
import ProductList from "./ProductList"
import Tag from "./Tag"
>>>>>>> 0197d0dac8e5ed7d8c9f376d951012dc977311e9
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