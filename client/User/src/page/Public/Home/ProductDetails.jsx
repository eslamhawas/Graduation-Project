import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../../Api/Axios";
import { Spin, Button } from 'antd';
import { LoadingOutlined, ArrowLeftOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import defaultImage from "../../../Image/iphone.jpeg";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:4100/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Product not found</div>;
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        Back
      </Button>

      
      <div style={{
        display: 'flex',
        gap: '40px',
        marginBottom: '40px'
      }}>
        
        <div style={{ flex: 1 }}>
          <img
            src={product.imageUrl || defaultImage}
            alt={product.name}
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
        </div>

       
        <div style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>
            {product?.name || 'Unnamed Product'}
          </h1>

          <h2 style={{
            fontSize: '1.5rem',
            color: '#DB4444',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            {product?.price != null ? `$${product.price.toFixed(2)}` : 'Price not available'}
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '1rem',
              color: '#555',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.
            </p>

            <hr style={{
              border: 'none',
              borderTop: '1px solid #eee',
              margin: '20px 0'
            }} />

            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '1rem', color: '#333' }}>Quantity:</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <Button
                  icon={<MinusOutlined />}
                  onClick={handleDecrease}
                  style={{ border: 'none' }}
                />
                <span style={{
                  padding: '0 15px',
                  fontSize: '1rem',
                  minWidth: '30px',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                <Button
                  icon={<PlusOutlined />}
                  onClick={handleIncrease}
                  style={{ border: 'none' }}
                />
              </div>
            </div>

            
            <Button
              type="primary"
              danger
              size="large"
              style={{
                width: '100%',
                height: '50px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Buy Now
            </Button>
          </div>

         
          <div style={{
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f9f9f9'
          }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              paddingBottom: '15px',
              marginBottom: '15px',
              borderBottom: '1px solid #eee'
            }}>
              <i className="fa-solid fa-truck" style={{
                fontSize: '20px',
                marginRight: '15px',
                flexShrink: 0
              }}></i>
              <div>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginBottom: '5px'
                }}>
                  Free Delivery
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Enter your postal code for Delivery Availability
                </div>
              </div>
            </div>

           
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <i className="fa-solid fa-rotate" style={{
                fontSize: '20px',
                marginRight: '15px',
                flexShrink: 0
              }}></i>
              <div>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginBottom: '5px'
                }}>
                  Return Delivery
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
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

