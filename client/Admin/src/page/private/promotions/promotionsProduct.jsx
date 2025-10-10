import { Button, DatePicker, Pagination, Select, Table } from "antd";
import { Form, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "./Api";
import { Avatar } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import cookies from "js-cookie";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";
export default function PromotionsProduct() {
  const { t } = useTranslation();
  const [Product, setProduct] = useState([]);
  const [Products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ln = cookies.get("i18next") || "en";
  const [currentValue, setCurrentValue] = useState(15);
  const navigate = useNavigate();

  const getPromotions = async () => {
    setLoading(true);
    try {
      const data = await ApiData().AllProduct(currentPage - 1, pageSize);
      setProduct(data.productPromotions);
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const allProducts = async () => {
    setLoading(true);
    try {
      const data = await ApiData().AllProducts();
      setProducts(data.data);
      console.log(data.data);
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    getPromotions();
    allProducts();
  }, []);

  useEffect(() => {
    getPromotions();
  }, [currentPage, pageSize]);

  const DelateProduct = async (id) => {
    try {
      await ApiData().DelateProduct(id);
      getPromotions();
      toast.success(t("Success"));
    } catch (err) {
      toast.error(err.message);
    }
  };


  const columns = [
    {
      title: t("Product Name"),
      dataIndex: "productName",
      key: "productName",
      align: "center"
    },

    {
      title: t("Price"),
      dataIndex: "productProviders",
      key: "price",
      align: "center",
      render: (_, record) => record.price ?? t("No Price")
    },
    {
      title: t("PricePromotions"),
      dataIndex: "PricePromotions",
      key: "PricePromotions",
      align: "center",
      render: (_, record) => record.promoPrice ?? t("No promoPrice")
    },
    {
      title: t("expiryDate"),
      dataIndex: "expiryDate",
      key: "expiryDate",
      align: "center",
      render: (_, record) =>
        record.expiryDate
          ? record.expiryDate.split("T")[0] // يأخذ فقط الجزء قبل الـ "T"
          : t("No expiryDate")
    },
    {
      title: t("promotionPercentage"),
      dataIndex: "promotionPercentage",
      key: "promotionPercentage",
      align: "center",
      render: (_, record) =>
        record.promotionPercentage || t("No promotionPercentage")
    },

    {
      title: t(""),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            onClick={() => DelateProduct(record.id)}
            color="danger"
            variant="solid"
          >
            {t("delete")}
          </Button>
        </div>
      )
    }
  ];

  const onFinish = async (values) => {
    const data = {
      ...values,
      active : true
    }
    await ApiData().promotionPercentage(data);
    getPromotions()
    console.log(values);
    
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Form
        name="customForm"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ maxWidth: 600 }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "end" }}>
          {/* Drop-down */}
          <Form.Item
            label={t("Select Product")}
            name="productProviderId"
            rules={[{ required: true, message: t("Please select a product") }]}
            style={{ flex: 1 }}
          >
            <Select
              placeholder={t("Choose a product")}
              size="small"
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {Products.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.product?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Expiry Date */}
          <Form.Item
            label={t("expiryDate")}
            name="expiryDate"
            rules={[
              { required: true, message: t("Please select expiry date") }
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              size="small"
            />
          </Form.Item>

          {/* Number Input */}
          <Form.Item
            label={t("promotionPercentage")}
            name="promotionPercentage"
            rules={[{ required: true, message: t("Please enter a number") }]}
            style={{ width: 180 }}
          >
            <Input type="number" size="small" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="small">
              {t("Submit")}
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Table
        columns={columns}
        dataSource={Product}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: Array.isArray(Product) ? Product.length : 0,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
          position: []
        }}
        footer={() => (
          <div
            style={{
              display: "flex",
              flexDirection: ln === "ar" ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                size="small"
              >
                <Option value={20}>20</Option>
                <Option value={40}>40</Option>
                <Option value={60}>60</Option>
              </Select>
            </div>

            <div>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={Array.isArray(Product) ? Product.length : 0}
                onChange={(page) => setCurrentPage(page)}
                size="small"
                showSizeChanger={false}
              />
            </div>
          </div>
        )}
      />
    </>
  );
}
