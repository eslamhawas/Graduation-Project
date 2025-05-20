import React from 'react';
import { Button, Typography } from 'antd';

const { Title } = Typography;

const CartSummary = ({ cartItems, onCheckout }) => {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  return (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <Title level={4}>Total:</Title>
        <Title level={4}>${totalPrice}</Title>
      </div>

      <Button
        type="primary"
        size="large"
        block
        style={{ marginTop: '24px' }}
        onClick={onCheckout}
      >
        Proceed to Checkout
      </Button>
    </>
  );
};

export default CartSummary;