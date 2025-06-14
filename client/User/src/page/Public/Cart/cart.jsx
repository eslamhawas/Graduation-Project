import React, { useEffect, useState } from "react";
import {
  Button,
  List,
  Typography,
  Space,
  Image,
  InputNumber,
  Spin,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../../Context/Cartcontext";
import axiosInstance from "../../../Api/Axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Cart = () => {
  const { cart } = useCart(); // optional
  const [product, setProduct] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const getCartProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("spring/api/v1/cart");
      setProduct(data);
    } catch (err) {
      toast.error(t("Failed to load cart"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCartProduct();
  }, []);

  const handleRemove = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`spring/api/v1/cart/item/${id}`);
      await getCartProduct();
      toast.success(t("Item removed"));
    } catch (err) {
      toast.error(t("Failed to remove item"));
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    const item = product.items.find((p) => p.productProviderId === id);
    if (!item) return;

    const validatedQuantity = Math.max(1, Math.floor(newQuantity));

    if (validatedQuantity > item.countInStock) {
      return toast.error(t("Quantity exceeds stock"));
    }

    if (validatedQuantity === item.quantity) return;

    setLoading(true);
    try {
      await axiosInstance.put("/spring/api/v1/cart", {
        productProviderId: id,
        quantity: validatedQuantity,
      });
      toast.success(t("Quantity updated"));
      await getCartProduct();
    } catch (err) {
      toast.error(t("Error updating quantity"));
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  };

  /**
   * CREATE ORDER
   */
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    if (product.items.length === 0) return;

    const orderPayload = {
      orderItems: product.items.map((item) => ({
        product: { id: item.productId },
        provider: { id: item.providerId },
        quantity: item.quantity,
      })),
    };

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        "nest/api/orders",
        orderPayload
      );
      toast.success(t("Order placed successfully"));
      // Optional: navigate to order details or thank you page
      navigate(`/order/${data.id}`);
    } catch (error) {
      toast.error(t("Failed to place order"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2}>
        {t("Your Cart")} ({product.items.length} {t("items")})
      </Title>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : product.items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#888",
            fontSize: "18px",
          }}
        >
          🛒 {t("Your cart is empty")}
        </div>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={product.items}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Space key={item.id}>
                    <Button
                      size="small"
                      onClick={() =>
                        handleQuantityChange(
                          item.productProviderId,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1 || loading}
                    >
                      -
                    </Button>

                    <InputNumber
                      min={1}
                      max={item.countInStock}
                      value={item.quantity}
                      onChange={(value) =>
                        handleQuantityChange(item.productProviderId, value)
                      }
                      disabled={loading}
                      style={{ width: "60px" }}
                    />

                    <Button
                      size="small"
                      onClick={() =>
                        handleQuantityChange(
                          item.productProviderId,
                          item.quantity + 1
                        )
                      }
                      disabled={item.quantity >= item.countInStock || loading}
                    >
                      +
                    </Button>

                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(item.productProviderId)}
                      disabled={loading}
                    />
                  </Space>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Image
                      width={80}
                      height={80}
                      src={item?.productImageUrl}
                      alt={item?.productName || t("Unnamed Product")}
                      preview={false}
                      style={{
                        objectFit: "cover",
                        backgroundColor: "#f0f0f0",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/80?text=No+Image";
                      }}
                    />
                  }
                  title={
                    <Text strong>
                      {item?.productName || t("Unnamed Product")}
                    </Text>
                  }
                  description={formatPrice(item?.discountedPrice)}
                />
                <div>
                  <Text strong>
                    {formatPrice(
                      (item.discountedPrice || 0) * (item.quantity || 1)
                    )}
                  </Text>
                </div>
              </List.Item>
            )}
          />

          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <Title level={4}>
              {t("Total")}: {formatPrice(product.total)}
            </Title>
            {/**
             * CREATE ORDER
             */}
            <Button
              type="primary"
              size="large"
              disabled={product.items.length === 0 || loading}
              onClick={handleCreateOrder}
            >
              {t("Proceed to Checkout")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
