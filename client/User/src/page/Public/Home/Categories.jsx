import React, { useState, useEffect } from 'react';
import { Row, Col, Card, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ControlOutlined, ClockCircleOutlined, MobileOutlined } from '@ant-design/icons';
import axiosInstance from "../../../Api/Axios";
const Categories = () => {
  const { token } = theme.useToken(); 
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:9999/nest/api/category");
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
      {categories.map((category) => {
        const isActive = location.pathname === `/category/${category.id}`;
        
        return (
          <Col key={category.id} xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                backgroundColor: isActive 
                  ? '#DB4444' 
                  : token.colorBgContainer,
                borderColor: isActive 
                  ? '#DB4444' 
                  : token.colorBorder,
                color: isActive 
                  ? 'white' 
                  : token.colorText,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              bodyStyle={{
                padding: '16px',
              }}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div style={{ 
                color: isActive ? 'white' : token.colorText,
                fontSize: '24px',
                marginBottom: '8px'
              }}>
                {categoryIcons[category.name] || <MobileOutlined />}
              </div>
              <h3 style={{ 
                margin: 0,
                color: isActive ? 'white' : token.colorText,
                fontWeight: 500
              }}>
                {category.name}
              </h3>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Categories;