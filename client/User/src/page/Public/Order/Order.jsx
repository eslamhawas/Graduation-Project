import React, { useEffect, useState } from "react";
import {
  Descriptions,
  List,
  Card,
  Timeline,
  Image,
  Typography,
  Spin,
  Divider,
} from "antd";
import axiosInstance from "../../../Api/Axios";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const getOrderItems = async (orderId = params?.id || 1) => {
    try {
      const { data } = await axiosInstance.get(`nest/api/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      toast.error(t("Failed to load order"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderItems();
  }, []);

  if (loading) return <Spin fullscreen size="large" tip="Loading Order..." />;

  if (!order) return <Text type="danger">{t("Order not found")}</Text>;

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "auto" }}>
      <Title level={2}>Order Summary</Title>

      <Descriptions
        bordered
        column={1}
        size="middle"
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
        <Descriptions.Item label="Subtotal">
          {order.subAmount} EGP
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          {order.totalAmount} EGP
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {new Date(order.createdDate).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={3}>Items</Title>
      <List
        itemLayout="vertical"
        dataSource={order.orderItems}
        renderItem={(item) => (
          <Card style={{ marginBottom: 16 }}>
            <List.Item>
              <List.Item.Meta
                avatar={<Image width={100} src={item.product.imageUrl} />}
                title={<b>{item.product.name}</b>}
                description={item.product.bio}
              />
              <div>
                <Text>Quantity: {item.quantity}</Text>
                <br />
                <Text>Sale Price: {item.itemSalePriceAfterProfitAndPromoIfExist} EGP</Text>
                <br />
                <Text>
                  Total: {(item.quantity * item.itemSalePriceAfterProfitAndPromoIfExist).toFixed(2)} EGP
                </Text>
                <br />
                <Text type="secondary">
                  Provider: {item.provider.fullName} ({item.provider.username})
                </Text>
              </div>
            </List.Item>
          </Card>
        )}
      />

      <Divider />

      <Title level={3}>Track Order</Title>
      <Timeline>
        <Timeline.Item color="blue">
          Order placed on {new Date(order.createdDate).toLocaleString()}
        </Timeline.Item>
        <Timeline.Item color="gray">Waiting for confirmation</Timeline.Item>
        <Timeline.Item color="gray">Order is being processed</Timeline.Item>
        <Timeline.Item color="gray">Ready for delivery</Timeline.Item>
        <Timeline.Item color="gray">Delivered</Timeline.Item>
      </Timeline>
    </div>
  );
};

export default OrderDetails;
