import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../../Api/Axios";
import { Spin, Button, InputNumber, theme } from 'antd'; // Import theme
import { LoadingOutlined, ArrowLeftOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import defaultImage from "../../../Image/iphone.jpeg";
import { useCart } from "../../Context/Cartcontext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { cart, dispatch } = useCart();
  const { token } = theme.useToken(); // Get theme tokens

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/nest/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (value === null || value === undefined) return;
    setQuantity(Math.max(1, Math.floor(value)));
  };

  const handleCartAction = () => {
    if (!product) return;

    if (cart.some(p => p.id === product.id)) {
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: { id: product.id }
      });
    } else {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl || defaultImage,
          quantity: quantity
        }
      });
    }
  };

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
        </div>
    );
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: token.colorTextSecondary }}>Product not found</div>;
  }

  return (
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto', // Increased top/bottom margin
        padding: '30px', // Increased padding
        fontFamily: 'Roboto, sans-serif', // Modern font
        backgroundColor: token.colorBgContainer, // Use theme background
        borderRadius: '16px', // More rounded container
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)', // More prominent shadow
      }}>

        <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              marginBottom: '30px', // More space below back button
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.1rem',
              color: token.colorTextSecondary,
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = token.colorPrimary}
            onMouseLeave={e => e.currentTarget.style.color = token.colorTextSecondary}
        >
          Back to Products
        </Button>

        <div style={{
          display: 'flex',
          flexDirection: 'row', // Ensure row direction on larger screens
          gap: '60px', // Increased gap
          marginBottom: '40px',
          flexWrap: 'wrap', // Allow wrapping on smaller screens
        }}>

          <div style={{ flex: 1, minWidth: '300px' }}> {/* Minimum width for image container */}
            <img
                src={product.imageUrl || defaultImage}
                alt={product.name}
                style={{
                  width: '100%',
                  maxHeight: '550px', // Increased max height
                  objectFit: 'contain',
                  borderRadius: '12px', // Rounded image corners
                  border: `1px solid ${token.colorBorderSecondary}`, // Subtle border around image
                  padding: '10px', // Padding inside image border
                }}
            />
          </div>

          <div style={{
            flex: 1.5, // Product info takes more space
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '350px', // Minimum width for info column
          }}>
            <h1 style={{
              fontSize: '2.8rem', // Larger product name
              color: token.colorText,
              marginBottom: '15px',
              fontWeight: 700,
              lineHeight: '1.2',
            }}>
              {product?.name || 'Unnamed Product'}
            </h1>

            <h2 style={{
              fontSize: '2.2rem', // Larger price
              color: token.colorPrimary, // Primary color for price
              fontWeight: 'bold',
              marginBottom: '30px', // More space below price
            }}>
              {product?.price != null ? `$${product.price.toFixed(2)}` : 'Price not available'}
            </h2>

            <div style={{ marginBottom: '30px' }}>
              <p style={{
                fontSize: '1.1rem', // Slightly larger description font
                color: token.colorTextSecondary, // Muted color for description
                lineHeight: '1.8', // Improved readability
                marginBottom: '40px', // More space below description
              }}>
                {product.description || 'No description available for this product.'}
              </p>

              <hr style={{
                border: 'none',
                borderTop: `1px solid ${token.colorBorder}`, // Theme border
                margin: '30px 0', // More margin for separator
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px', // Increased gap
                marginBottom: '30px', // More space below quantity
              }}>
                <span style={{ fontSize: '1.1rem', color: token.colorText }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange(quantity - 1)}
                      style={{
                        borderColor: token.colorBorder,
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                        height: '40px',
                        width: '40px',
                        borderRadius: '8px 0 0 8px',
                        borderRight: 'none',
                      }}
                      disabled={quantity <= 1}
                  />
                  <InputNumber
                      min={1}
                      value={quantity}
                      onChange={handleQuantityChange}
                      style={{
                        width: '80px', // Wider input number
                        height: '40px',
                        borderRadius: 0,
                        border: `1px solid ${token.colorBorder}`,
                        borderLeft: 'none',
                        borderRight: 'none',
                        textAlign: 'center',
                        fontSize: '1rem',
                        color: token.colorText,
                        backgroundColor: token.colorBgContainer,
                      }}
                      controls={false} // Hide default controls
                  />
                  <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange(quantity + 1)}
                      style={{
                        borderColor: token.colorBorder,
                        backgroundColor: token.colorBgContainer,
                        color: token.colorText,
                        height: '40px',
                        width: '40px',
                        borderRadius: '0 8px 8px 0',
                        borderLeft: 'none',
                      }}
                  />
                </div>
              </div>
              <Button
                  type="primary"
                  danger={cart.some(p => p.id === product.id)}
                  size="large"
                  style={{
                    width: '100%',
                    height: '60px', // Taller button
                    fontSize: '1.2rem', // Larger font
                    fontWeight: 'bold',
                    borderRadius: '10px', // Rounded button
                    marginTop: '10px',
                    backgroundColor: cart.some(p => p.id === product.id) ? token.colorError : token.colorPrimary,
                  }}
                  onClick={handleCartAction}
              >
                {cart.some(p => p.id === product.id)
                    ? "Remove from Cart"
                    : `Add to Cart (${quantity})`}
              </Button>
            </div>

            <div style={{
              border: `1px solid ${token.colorBorder}`, // Use theme border
              borderRadius: '12px', // Rounded corners
              padding: '25px', // Increased padding
              backgroundColor: token.colorFillAlter, // Lighter background for info box
              marginTop: 'auto', // Push to bottom if space allows
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '20px', // Increased padding
                marginBottom: '20px', // Increased margin
                borderBottom: `1px solid ${token.colorBorderSecondary}`, // Muted border
              }}>
                <i className="fa-solid fa-truck" style={{
                  fontSize: '28px', // Larger icon
                  marginRight: '20px',
                  flexShrink: 0,
                  color: token.colorText,
                }}></i>
                <div>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem', // Larger text
                    marginBottom: '8px',
                    color: token.colorText,
                  }}>
                    Free Delivery
                  </div>
                  <div style={{ fontSize: '1rem', color: token.colorTextSecondary }}>
                    Enter your postal code for Delivery Availability
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="fa-solid fa-rotate" style={{
                  fontSize: '28px', // Larger icon
                  marginRight: '20px',
                  flexShrink: 0,
                  color: token.colorText,
                }}></i>
                <div>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem', // Larger text
                    marginBottom: '8px',
                    color: token.colorText,
                  }}>
                    Return Delivery
                  </div>
                  <div style={{ fontSize: '1rem', color: token.colorTextSecondary }}>
                    Free 30 Days Delivery Returns. Details
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductDetails;