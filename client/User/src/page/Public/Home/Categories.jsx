import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ControlOutlined, ClockCircleOutlined, MobileOutlined } from '@ant-design/icons';
import axiosInstance from "../../../Api/Axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:4100/api/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const categoryIcons = {
    Gaming: <ControlOutlined style={{ fontSize: '24px' }} />,
    Smartwatches: <ClockCircleOutlined style={{ fontSize: '24px' }} />,
    Phones: <MobileOutlined style={{ fontSize: '24px' }} />,
  };

  return (
    <Row gutter={[16, 16]} justify="center" style={{ margin: '20px 40px' }}>
      {categories.map((category) => (
        <Col key={category.id} xs={12} sm={8} md={6} lg={4}>
          <Card
            hoverable
            style={{
              textAlign: 'center',
              backgroundColor: location.pathname === `/category/${category.id}` 
                ? '#DB4444' 
                : 'white',
              cursor: 'pointer',
            }}
            onClick={() => handleCategoryClick(category.id)}
          >
            {categoryIcons[category.name] || <MobileOutlined style={{ fontSize: '24px' }} />}
            <h3>{category.name}</h3>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Categories;