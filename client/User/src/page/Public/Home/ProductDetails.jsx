import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axiosInstance from "../../../Api/Axios";
import {Button, InputNumber, Spin, theme, Tag, Table, Space} from "antd";
import {ArrowLeftOutlined, LoadingOutlined, MinusOutlined, PlusOutlined, ShopOutlined, TagOutlined, AppstoreOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import defaultImage from "../../../Image/iphone.jpeg";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

const ProductDetails = () => {
  const {id, providerId} = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentProductProvider, setCurrentProductProvider] = useState({})
  const [restOfTheProviders, setRestOfTheProviders] = useState([])
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [loadingProviders, setLoadingProviders] = useState({});
  const {token} = theme.useToken();
  const {t} = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/nest/api/products/${id}`);
        const data = response.data;
        const numericProviderId = parseInt(providerId, 10);
        const { provider, rest } = data.productProviders.reduce(
          (acc, currentProvider) => {
            if (currentProvider.id === numericProviderId) {
              acc.provider = currentProvider;
            } else {
              acc.rest.push(currentProvider);
            }
            return acc;
          },
          { provider: null, rest: [] }
        );

        setCurrentProductProvider(provider);
        setRestOfTheProviders(rest);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(t("ConnectionProblemOccurred"));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleQuantityChange = (value) => {
    if (value === null || value === undefined) return;
    if (value > currentProductProvider.countInStock) {
      toast.error(t("Quantity exceeds available stock"));
      return;
    }
    setQuantity(Math.max(1, Math.floor(value)));
  };

  const handleCartAction = async (productProviderId = null, providerQuantity = 1) => {
    const targetProviderId = productProviderId || currentProductProvider?.id;
    const targetQuantity = productProviderId ? providerQuantity : quantity;

    if (!targetProviderId) {
      toast.error(t("Product provider not available"));
      return;
    }

    const targetProvider = productProviderId
      ? restOfTheProviders.find(p => p.id === productProviderId)
      : currentProductProvider;

    if (targetQuantity > targetProvider.countInStock) {
      toast.error(t("Quantity exceeds available stock"));
      return;
    }

    if (productProviderId) {
      setLoadingProviders(prev => ({ ...prev, [productProviderId]: true }));
    } else {
      setLoading(true);
    }

    try {
      await axiosInstance.post("spring/api/v1/cart", {
        productProviderId: targetProviderId,
        quantity: targetQuantity
      });
      toast.success(t("Added to cart"));
    } catch (err) {
      toast.error(t("Error adding to cart"));
    } finally {
      if (productProviderId) {
        setLoadingProviders(prev => ({ ...prev, [productProviderId]: false }));
      } else {
        setLoading(false);
      }
    }
  };

  const providerColumns = [
    {
      title: t("Provider"),
      dataIndex: 'provider',
      key: 'provider',
      render: (provider) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '600', color: token.colorText }}>
            {provider.fullName}
          </span>
          <span style={{ fontSize: '0.85rem', color: token.colorTextSecondary }}>
            @{provider.username}
          </span>
          {provider.bio && (
            <span style={{
              fontSize: '0.8rem',
              color: token.colorTextTertiary,
              fontStyle: 'italic',
              marginTop: '2px'
            }}>
              {provider.bio.length > 50 ? `${provider.bio.substring(0, 50)}...` : provider.bio}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t("Price"),
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: token.colorPrimary
          }}>
            ${record.salePriceAfterProfitAndPromotion != null
            ? record.salePriceAfterProfitAndPromotion.toFixed(2)
            : record.salePriceAfterProfit.toFixed(2)}
          </span>
          {record.salePriceAfterProfitAndPromotion != null && (
            <span style={{
              fontSize: '0.9rem',
              color: token.colorTextSecondary,
              textDecoration: 'line-through'
            }}>
              ${record.salePriceAfterProfit.toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t("Stock"),
      dataIndex: 'countInStock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock > 0 ? `${stock} ${t("in stock")}` : t("Out of stock")}
        </Tag>
      ),
    },
    {
      title: t("Action"),
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          loading={loadingProviders[record.id]}
          disabled={record.countInStock === 0}
          onClick={() => handleCartAction(record.id, 1)}
          style={{
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          {t("Add to Cart")}
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}
      >
        <Spin indicator={<LoadingOutlined style={{fontSize: 36}} spin />} />
      </div>
    );
  }

  if (!currentProductProvider) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          fontSize: "1.2rem",
          color: token.colorTextSecondary
        }}
      >
        {t("Product not found")}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "30px",
        fontFamily: "Roboto, sans-serif",
        backgroundColor: token.colorBgContainer,
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)"
      }}
    >
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          fontSize: "1.1rem",
          color: token.colorTextSecondary,
          transition: "color 0.3s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = token.colorPrimary)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = token.colorTextSecondary)
        }
      >
        {t("Back to Products")}
      </Button>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "60px",
          marginBottom: "40px",
          flexWrap: "wrap"
        }}
      >
        <div style={{flex: 1, minWidth: "300px"}}>
          <img
            src={product.imageUrl}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "550px",
              objectFit: "contain",
              borderRadius: "12px",
              border: `1px solid ${token.colorBorderSecondary}`,
              padding: "10px"
            }}
          />
        </div>

        <div
          style={{
            flex: 1.5,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            minWidth: "350px"
          }}
        >
          <h1
            style={{
              fontSize: "2.8rem",
              color: token.colorText,
              marginBottom: "15px",
              fontWeight: 700,
              lineHeight: "1.2"
            }}
          >
            {product?.name || t("Unnamed Product")}
          </h1>

          {/* Brand Section */}
          {product?.brand && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                padding: "12px 16px",
                backgroundColor: token.colorFillAlter,
                borderRadius: "8px",
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <TagOutlined
                style={{
                  fontSize: "18px",
                  color: token.colorPrimary,
                  marginRight: "12px"
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: token.colorTextSecondary,
                    fontWeight: "500"
                  }}
                >
                  {t("Brand")}:
                </span>
                <span
                  style={{
                    fontSize: "1.1rem",
                    color: token.colorText,
                    fontWeight: "600",
                    marginLeft: "8px"
                  }}
                >
                  {product.brand.name}
                </span>
              </div>
            </div>
          )}

          {/* Categories Section */}
          {product?.categories && product.categories.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                backgroundColor: token.colorFillAlter,
                borderRadius: "8px",
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px"
                }}
              >
                <AppstoreOutlined
                  style={{
                    fontSize: "18px",
                    color: token.colorPrimary,
                    marginRight: "12px"
                  }}
                />
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: token.colorTextSecondary,
                    fontWeight: "500"
                  }}
                >
                  {t("Categories")}:
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {product.categories.map((category, index) => (
                  <Tag
                    key={category.id || index}
                    color="blue"
                    style={{
                      fontSize: "0.95rem",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      border: "none",
                      fontWeight: "500"
                    }}
                  >
                    {category.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Provider Section */}
          {currentProductProvider?.provider && (
            <div
              style={{
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: token.colorFillAlter,
                borderRadius: "8px",
                border: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px"
                }}
              >
                <ShopOutlined
                  style={{
                    fontSize: "18px",
                    color: token.colorPrimary,
                    marginRight: "12px"
                  }}
                />
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: token.colorTextSecondary,
                    fontWeight: "500"
                  }}
                >
                  {t("Sold by")}:
                </span>
              </div>
              <div style={{ marginLeft: "30px" }}>
                <div
                  style={{
                    fontSize: "1.1rem",
                    color: token.colorText,
                    fontWeight: "600",
                    marginBottom: "4px"
                  }}
                >
                  {currentProductProvider.provider.fullName}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: token.colorTextSecondary
                  }}
                >
                  @{currentProductProvider.provider.username}
                </div>
                {currentProductProvider.provider.bio && (
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: token.colorTextSecondary,
                      marginTop: "6px",
                      fontStyle: "italic"
                    }}
                  >
                    {currentProductProvider.provider.bio}
                  </div>
                )}
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: token.colorSuccess,
                    marginTop: "8px",
                    fontWeight: "500"
                  }}
                >
                  {t("In Stock")}: {currentProductProvider.countInStock} {t("items")}
                </div>
              </div>
            </div>
          )}

          <h2
            style={{
              fontSize: "2.2rem",
              color: token.colorPrimary,
              fontWeight: "bold",
              marginBottom: "30px"
            }}
          >
            {currentProductProvider?.salePriceAfterProfitAndPromotion != null
              ? `$${currentProductProvider.salePriceAfterProfitAndPromotion.toFixed(2)}`
              : `$${currentProductProvider.salePriceAfterProfit.toFixed(2)}`}
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: token.colorTextSecondary,
              lineHeight: "1.8",
              marginBottom: "40px"
            }}
          >
            {product.description ||
              t("No description available for this product.")}
          </p>

          <hr
            style={{
              border: "none",
              borderTop: `1px solid ${token.colorBorder}`,
              margin: "30px 0"
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "30px"
            }}
          >
            <span style={{fontSize: "1.1rem", color: token.colorText}}>
              {t("Quantity")}:
            </span>
            <div style={{display: "flex", alignItems: "center"}}>
              <Button
                icon={<MinusOutlined />}
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                style={{
                  borderColor: token.colorBorder,
                  backgroundColor: token.colorBgContainer,
                  color: token.colorText,
                  height: "40px",
                  width: "40px",
                  borderRadius: "8px 0 0 8px",
                  borderRight: "none"
                }}
              />
              <InputNumber
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                style={{
                  width: "80px",
                  height: "40px",
                  borderRadius: 0,
                  border: `1px solid ${token.colorBorder}`,
                  borderLeft: "none",
                  borderRight: "none",
                  textAlign: "center",
                  fontSize: "1rem",
                  color: token.colorText,
                  backgroundColor: token.colorBgContainer
                }}
                controls={false}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleQuantityChange(quantity + 1)}
                style={{
                  borderColor: token.colorBorder,
                  backgroundColor: token.colorBgContainer,
                  color: token.colorText,
                  height: "40px",
                  width: "40px",
                  borderRadius: "0 8px 8px 0",
                  borderLeft: "none"
                }}
              />
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => handleCartAction()}
            style={{
              width: "100%",
              height: "60px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "10px",
              marginTop: "10px",
              background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
            }}
          >
            {t("Add to Cart")}
          </Button>

          <div
            style={{
              border: `1px solid ${token.colorBorder}`,
              borderRadius: "12px",
              padding: "25px",
              backgroundColor: token.colorFillAlter,
              marginTop: "30px"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "20px",
                marginBottom: "20px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`
              }}
            >
              <i
                className="fa-solid fa-truck"
                style={{
                  fontSize: "28px",
                  marginRight: "20px",
                  flexShrink: 0,
                  color: token.colorText
                }}
              ></i>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    marginBottom: "8px",
                    color: token.colorText
                  }}
                >
                  {t("Free Delivery")}
                </div>
                <div
                  style={{fontSize: "1rem", color: token.colorTextSecondary}}
                >
                  {t("Enter your postal code for Delivery Availability")}
                </div>
              </div>
            </div>

            <div style={{display: "flex", alignItems: "center"}}>
              <i
                className="fa-solid fa-rotate"
                style={{
                  fontSize: "28px",
                  marginRight: "20px",
                  flexShrink: 0,
                  color: token.colorText
                }}
              ></i>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    marginBottom: "8px",
                    color: token.colorText
                  }}
                >
                  {t("Return Delivery")}
                </div>
                <div
                  style={{fontSize: "1rem", color: token.colorTextSecondary}}
                >
                  {t("Free 30 Days Delivery Returns. Details")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Providers Table */}
      {restOfTheProviders && restOfTheProviders.length > 0 && (
        <div
          style={{
            marginTop: "50px",
            padding: "30px",
            backgroundColor: token.colorFillAlter,
            borderRadius: "12px",
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <h3
            style={{
              fontSize: "1.8rem",
              color: token.colorText,
              marginBottom: "20px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center"
            }}
          >
            <ShopOutlined
              style={{
                fontSize: "24px",
                color: token.colorPrimary,
                marginRight: "12px"
              }}
            />
            {t("Other Providers")}
          </h3>
          <p
            style={{
              fontSize: "1rem",
              color: token.colorTextSecondary,
              marginBottom: "25px"
            }}
          >
            {t("Compare prices and options from other providers selling this product")}
          </p>
          <Table
            columns={providerColumns}
            dataSource={restOfTheProviders}
            rowKey="id"
            pagination={false}
            style={{
              backgroundColor: token.colorBgContainer,
              borderRadius: "8px"
            }}
            scroll={{ x: 800 }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;