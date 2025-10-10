import Categories from "./Categories"
import ProductList from "./ProductList"
import Slider from "./Slider"
import Tag from "./Tag"
import "./Home.css"

export default function Home() {
    return (
        <div className="enhanced-home-container">
            <Categories />
            <div className="home-content">
                <Slider />
                <Tag/>
                <ProductList type="bestSelling" />
                <ProductList type="allProducts" />
            </div>
        </div>
    )
}

