import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Api/Axios";
import { Spin, Button, InputNumber, theme } from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  MinusOutlined,
  PlusOutlined
} from "@ant-design/icons";
import defaultImage from "../../../Image/iphone.jpeg";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { token } = theme.useToken();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/nest/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(t("ConnectionProblemOccurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (value === null || value === undefined) return;
    setQuantity(Math.max(1, Math.floor(value)));
  };

  const handleCartAction = async () => {
    if (!product || !product.productProviders?.[0]?.id) {
      toast.error(t("Product provider not available"));
      return;
    }

    if (quantity > product.productProviders[0].countInStock) {
      toast.error(t("Quantity exceeds available stock"));
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("spring/api/v1/cart", {
        productProviderId: product.productProviders[0].id,
        quantity: quantity
      });
      toast.success(t("Added to cart"));
    } catch (err) {
      toast.error(t("Error adding to cart"));
    } finally {
      setLoading(false);
    }
  };

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
        <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
      </div>
    );
  }

  if (!product) {
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
        <div style={{ flex: 1, minWidth: "300px" }}>
          <img
            src={product.imageUrl || defaultImage}
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

          <h2
            style={{
              fontSize: "2.2rem",
              color: token.colorPrimary,
              fontWeight: "bold",
              marginBottom: "30px"
            }}
          >
            {product?.price != null
              ? `$${product.price.toFixed(2)}`
              : t("Price not available")}
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
            <span style={{ fontSize: "1.1rem", color: token.colorText }}>
              {t("Quantity")}:
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
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
            onClick={handleCartAction}
            style={{
              width: "100%",
              height: "60px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "10px",
              marginTop: "10px"
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
              marginTop: "auto"
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
                  style={{ fontSize: "1rem", color: token.colorTextSecondary }}
                >
                  {t("Enter your postal code for Delivery Availability")}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
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
                  style={{ fontSize: "1rem", color: token.colorTextSecondary }}
                >
                  {t("Free 30 Days Delivery Returns. Details")}
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
