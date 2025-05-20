import React from 'react';
import { Button, List, Typography, Space, Image, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../../Context/Cartcontext';

const { Title, Text } = Typography;

const Cart = () => {
  const { cart, dispatch } = useCart();
  
  const handleRemove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const handleQuantityChange = (id, newQuantity) => {
    const validatedQuantity = Math.max(1, newQuantity);
    dispatch({ 
      type: "UPDATE_QUANTITY", 
      payload: { id, quantity: validatedQuantity } 
    });
  };
  const totalPrice = cart.reduce((total, item) => {
    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 0;
    return total + (price * quantity);
  }, 0);
  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Your Cart ({cart.length} items)</Title>

      {cart.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Space>
                    <Button 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.id, value)}
                      style={{ width: '60px' }}
                    />
                    
                    <Button 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(item.id)}
                    />
                  </Space>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Image
                      width={80}
                      height={80}
                      src={item?.image}
                      alt={item?.name || 'Product image'}
                      preview={false}
                      style={{ 
                        objectFit: 'cover',
                        backgroundColor: '#f0f0f0'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                      }}
                    />
                  }
                  title={<Text strong>{item?.name || 'Unnamed Product'}</Text>}
                  description={formatPrice(item?.price)}
                />
                <div>
                  <Text strong>
                    {formatPrice((item.price || 0) * (item.quantity || 1))}
                  </Text>
                </div>
              </List.Item>
            )}
          />

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Title level={4}>Total: {formatPrice(totalPrice)}</Title>
            <Button 
              type="primary" 
              size="large" 
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;