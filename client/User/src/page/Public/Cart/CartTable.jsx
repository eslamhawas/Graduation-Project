import React from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CartTable = ({ cartItems, onDelete, onDeleteAll, onQuantityChange }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => onQuantityChange(record.id, quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <Text>{quantity}</Text>
          <Button 
            size="small" 
            onClick={() => onQuantityChange(record.id, quantity + 1)}
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => onDelete(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cartItems}
      pagination={false}
      rowKey="id"
      footer={() => (
        <div style={{ textAlign: 'right' }}>
          <Button 
            danger 
            onClick={onDeleteAll}
            style={{ marginRight: '16px' }}
          >
            Delete All
          </Button>
        </div>
      )}
    />
  );
};

export default CartTable;