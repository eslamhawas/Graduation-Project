import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import "./ProductCard.css";

function ProductCard({ product }) {
    const navigate = useNavigate();
    const imageUrl = product.imageUrl;

    const handleClick = () => {
        navigate(`/products/${product.id}`);
    };

    const handleQuickAction = (e, action) => {
        switch (action) {
            case 'cart':
                console.log(`Added ${product.name} to cart`);
                break;
            case 'view':
                handleClick();
                break;
            default:
                break;
        }
    };

    return (
        <Card
            hoverable
            onClick={handleClick}
            className="enhanced-product-card"
            style={{
                width: 280,
                height: 380,
                margin: "auto",
                borderRadius: "16px",
                overflow: "hidden",
                border: "none",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
            }}
            bodyStyle={{ 
                padding: "16px 20px 20px", 
                textAlign: "left",
                height: "140px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
            cover={
                <div className="product-image-container">
                    <img
                        alt={product.name}
                        src={imageUrl}
                        className="product-image"
                    />
                    <div className="product-overlay">
                        <div className="quick-actions">
                            <button 
                                className="quick-action-btn"
                                onClick={(e) => handleQuickAction(e, 'wishlist')}
                                title="Add to Wishlist"
                            >
                                <HeartOutlined />
                            </button>
                            <button 
                                className="quick-action-btn"
                                onClick={(e) => handleQuickAction(e, 'cart')}
                                title="Add to Cart"
                            >
                                <ShoppingCartOutlined />
                            </button>
                            <button 
                                className="quick-action-btn"
                                onClick={(e) => handleQuickAction(e, 'view')}
                                title="Quick View"
                            >
                                <EyeOutlined />
                            </button>
                        </div>
                    </div>
                    <div className="product-badge">New</div>
                </div>
            }
        >
            <div className="product-info">
                <h3 className="product-title">
                    {product.name}
                </h3>
                <div className="product-price-container">
                    <span className="product-price">
                        ${product.price}
                    </span>
                    <div className="product-rating">
                        <span className="rating-stars">★★★★☆</span>
                        <span className="rating-count">(24)</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ProductCard;

