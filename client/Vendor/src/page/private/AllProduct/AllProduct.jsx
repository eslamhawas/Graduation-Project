import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4100/api/products'); 
      const apiData = response.data.data;

      const mappedData = apiData.map((item) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        Price: item.price,
        Type: item.categories[0]?.name || 'Unknown',
        Quantity: item.productProviders[0]?.countInStock || 0,
        img: item.imageUrl || 'https://via.placeholder.com/60',
      }));

      setProducts(mappedData);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = (id) => {
    console.log('Delete product with ID:', id);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
    },
    {
      title: 'Img',
      dataIndex: 'img',
      key: 'img',
      render: (_, record) => (
        <img
          style={{ width: "50px", height: "60px", borderRadius: "60%" }}
          src={record.img}
          alt='Product'
        />
      ),
    },
    {
      title: '',
      key: 'Update',
      render: (_, record) => (
        <Link to={`/AddProduct/${record.id}`}>Update</Link>
      ),
    },
    {
      title: '',
      key: 'Delete',
      render: (_, record) => (
        <a onClick={() => deleteProduct(record.id)}>Delete</a>
      ),
    },
  ];

 return (
  <>
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      pagination={{ pageSize: 20 }}
    />
  </>
);
}
