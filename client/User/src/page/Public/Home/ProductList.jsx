import { useEffect, useState } from "react";
import ProductCard from "./ProductCard"; 
import { Row, Col, Pagination, Spin } from "antd"; 
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import axiosInstance from "../../../Api/Axios";
import "./ProductList.css";

function ProductList({ type }) {
    const [allProducts, setAllProducts] = useState([]); 
    const [displayedProducts, setDisplayedProducts] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const pageSize = 8; 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = {
                    status: "ACCEPTED",
                    ...(type === "bestSelling" && { take: 4 }) 
                };
                
                const response = await axiosInstance.get("/nest/api/products", { params });
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sectionTitle = type === "bestSelling" ? t('home.best_selling_products') : t('home.all_products');

    return (
        <div className="enhanced-product-list">
            <div className="section-header">
                <h2 className="section-title">{sectionTitle}</h2>
                <div className="section-subtitle">
                    {type === "bestSelling" 
                        ? t('home.discover_popular')
                        : t('home.showing_products', { count: displayedProducts.length, total: allProducts.length })
                    }
                </div>
            </div>
            
            {loading ? (
                <div className="loading-container">
                    <Spin 
                        indicator={<LoadingOutlined style={{ fontSize: 32, color: '#DB4444' }} spin />} 
                        size="large"
                    />
                    <p className="loading-text">{t('home.loading_products')}</p>
                </div>
            ) : (
                <>
                    <Row gutter={[24, 32]} className="products-grid">
                        {displayedProducts.map((product, index) => (
                            <Col 
                                key={product.id} 
                                xs={24} 
                                sm={12} 
                                md={8} 
                                lg={6}
                                className="product-col"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>

                    {displayedProducts.length === 0 && !loading && (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>{t('home.no_products_found')}</h3>
                            <p>{t('home.no_products_message')}</p>
                        </div>
                    )}

                    {type !== "bestSelling" && allProducts.length > pageSize && (
                        <div className="pagination-container">
                            <Pagination
                                current={currentPage}
                                total={allProducts.length}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) => 
                                    `${range[0]}-${range[1]} of ${total} products`
                                }
                                className="enhanced-pagination"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProductList;

