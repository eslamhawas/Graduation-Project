<<<<<<< HEAD

import { Table } from 'antd';
import { Link } from 'react-router-dom';



const data = [
  {
    id: 1,
    name: 'Laptop Lenovo',
    Price: 1200,
    Type: 'Laptop',
    Quantity: '5',
    key: '1',
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '2',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '3',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '4',
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '5',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '6',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '7',
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '8',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '9',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '10',
  },
  {
    id: 2,
    name: 'Jim Green',
    Price: 42,
    Type: 'London No. 1 Lake Park',
    Quantity: '20',
    key: '11',
  },
  {
    id: 3,
    name: 'Not Expandable',
    Price: 29,
    Type: 'Jiangsu No. 1 Lake Park',
    Quantity: '40',
    key: '12',
  },
  {
    id: 4,
    name: 'Joe Black',
    Price: 32,
    Type: 'Sydney No. 1 Lake Park',
    Quantity: '50',
    key: '13',
  },

];
=======
import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
>>>>>>> 0197d0dac8e5ed7d8c9f376d951012dc977311e9

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

<<<<<<< HEAD


  return (<>
=======
 return (
  <>
>>>>>>> 0197d0dac8e5ed7d8c9f376d951012dc977311e9
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      pagination={{ pageSize: 20 }}
    />
  </>
);
}
