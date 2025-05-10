import { useEffect, useState } from "react";
import ProductCard from "./ProductCard"; 
import { Row, Col, Pagination } from "antd"; 
import axiosInstance from "../../../Api/Axios";  
function ProductList({ type }) {
  const [allProducts, setAllProducts] = useState([]); 
  const [displayedProducts, setDisplayedProducts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 8; 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          status: "ACCEPTED",
          ...(type === "bestSelling" && { take: 4 }) 
        };
        
        const response = await axiosInstance.get("http://localhost:4100/api/products", { params });
        const result = response.data;
        const data = Array.isArray(result) ? result : result.data || [];
        
        setAllProducts(data);
        
        if (type !== "bestSelling") {
          const startIdx = (currentPage - 1) * pageSize;
          const endIdx = startIdx + pageSize;
          setDisplayedProducts(data.slice(startIdx, endIdx));
        } else {
          setDisplayedProducts(data); 
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
        setDisplayedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ margin: "20px 40px" }}>
      <h2>{type === "bestSelling" ? "Best Selling Products" : "All Products"}</h2>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <span>Loading products...</span>
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {displayedProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {type !== "bestSelling" && allProducts.length > pageSize && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <Pagination
                current={currentPage}
                total={allProducts.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;