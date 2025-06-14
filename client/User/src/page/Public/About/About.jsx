import React from 'react';
import { Typography, Row, Col, Card, theme, Divider } from 'antd';
import {
  ShoppingCartOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function About() {
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const features = [
    {
      icon: <ShoppingCartOutlined style={{ fontSize: '32px', color: '#DB4444' }} />,
      title: t('about.wide_selection'),
      description: t('about.wide_selection_description')
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#DB4444' }} />,
      title: t('about.secure_shopping'),
      description: t('about.secure_shopping_description')
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: '32px', color: '#DB4444' }} />,
      title: t('about.expert_support'),
      description: t('about.expert_support_description')
    },
    {
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#DB4444' }} />,
      title: t('about.fast_delivery'),
      description: t('about.fast_delivery_description')
    }
  ];

  return (
    <div style={{
      padding: '60px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: `linear-gradient(180deg, ${token.colorBgElevated} 0%, ${token.colorBgContainer} 100%)`,
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '80px',
        background: token.colorBgElevated,
        padding: '60px 40px',
        borderRadius: '24px',
        boxShadow: `0 20px 40px ${token.colorBgContainer}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #DB4444, transparent)',
        }} />
        <Title level={1} style={{
          color: token.colorText,
          marginBottom: '28px',
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          position: 'relative',
        }}>
          {t('about.welcome_to_store')}
        </Title>
        <Paragraph style={{
          fontSize: '1.2rem',
          color: token.colorTextSecondary,
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          {t('about.store_description')}
        </Paragraph>
      </div>

      {/* Mission Section */}
      <Row gutter={[32, 32]} style={{ marginBottom: '80px' }}>
        <Col xs={24} md={12}>
          <Card
            style={{
              height: '100%',
              background: token.colorBgContainer,
              borderRadius: '16px',
              border: 'none',
              boxShadow: `0 8px 24px ${token.colorBorder}`,
              transition: 'all 0.3s ease',
            }}
            hoverable
          >
            <div style={{
              borderLeft: '4px solid #DB4444',
              paddingLeft: '20px',
              marginBottom: '20px'
            }}>
              <Title level={3} style={{
                color: token.colorText,
                marginBottom: '8px',
                fontSize: '1.8rem',
              }}>
                {t('about.our_mission')}
              </Title>
            </div>
            <Paragraph style={{
              color: token.colorTextSecondary,
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}>
              {t('about.mission_description')}
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            style={{
              height: '100%',
              background: token.colorBgContainer,
              borderRadius: '16px',
              border: 'none',
              boxShadow: `0 8px 24px ${token.colorBorder}`,
              transition: 'all 0.3s ease',
            }}
            hoverable
          >
            <div style={{
              borderLeft: '4px solid #DB4444',
              paddingLeft: '20px',
              marginBottom: '20px'
            }}>
              <Title level={3} style={{
                color: token.colorText,
                marginBottom: '8px',
                fontSize: '1.8rem',
              }}>
                {t('about.our_vision')}
              </Title>
            </div>
            <Paragraph style={{
              color: token.colorTextSecondary,
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}>
              {t('about.vision_description')}
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Features Section */}
      <Divider style={{
        borderColor: token.colorBorder,
        margin: '60px 0',
        position: 'relative',
      }}>
        <Title level={2} style={{
          color: token.colorText,
          fontSize: '2.2rem',
          fontWeight: 700,
        }}>
          {t('about.why_choose_us')}
        </Title>
      </Divider>

      <Row gutter={[32, 32]} style={{ marginTop: '40px' }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              style={{
                textAlign: 'center',
                height: '100%',
                background: token.colorBgContainer,
                borderRadius: '16px',
                border: 'none',
                boxShadow: `0 8px 24px ${token.colorBorder}`,
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
              hoverable
            >
              <div style={{
                marginBottom: '20px',
                transform: 'scale(1.2)',
                transition: 'transform 0.3s ease',
              }}>{feature.icon}</div>
              <Title level={4} style={{
                color: token.colorText,
                marginBottom: '16px',
                fontSize: '1.3rem',
                fontWeight: 600,
              }}>
                {feature.title}
              </Title>
              <Paragraph style={{
                color: token.colorTextSecondary,
                marginBottom: 0,
                fontSize: '1rem',
                lineHeight: 1.5,
              }}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
