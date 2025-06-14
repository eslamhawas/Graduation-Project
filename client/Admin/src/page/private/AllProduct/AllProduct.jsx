import { Button, Pagination, Select, Table } from "antd";
import { Form, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "./Api";
import { Avatar } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import cookies from "js-cookie";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";
export default function AllProduct() {
  const { t } = useTranslation();
  const [Product, setProduct] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ln = cookies.get("i18next") || "en";
  const [currentValue, setCurrentValue] = useState(15);
  const navigate = useNavigate();

  const gitProduct = async () => {
    setLoading(true);
    try {
      const data = await ApiData().AllProduct(currentPage, pageSize);
      setProduct(data.data);
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const gatProfit = async () => {
    setLoading(true);
    try {
      const Data = await ApiData().GetProfitMargin();
      setCurrentValue(Data.current);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gitProduct();
    gatProfit();
  }, []);

  useEffect(() => {
    gitProduct();
  }, [currentPage, pageSize]);

  const StateProduct = async (id) => {
    try {
      const body = {
        status: "ACCEPTED"
      };
      await ApiData().StateProduct(id, body);
      gitProduct();
      toast.success(t("Success"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const AddProductInTable = async (id) => {
    navigate(`/AddProduct/${id}`);
  };

  const columns = [
    {
      title: t("Product Name"),
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (_, record) => record.product?.name || t("No Category")
    },
    {
      title: t("Category"),
      dataIndex: "categories",
      key: "category",
      align: "center",
      render: (_, record) =>
        record.product?.categories?.[0]?.name || t("No Category")
    },
    {
      title: t("Brand"),
      dataIndex: "brand",
      key: "brand",
      align: "center",
      render: (_, record) => record.product?.brand?.name || t("No Brand")
    },
    {
      title: t("Price"),
      dataIndex: "productProviders",
      key: "price",
      align: "center",
      render: (_, record) => record.salePrice ?? t("No Price")
    },
    {
      title: t("AfterProfit"),
      dataIndex: "salePriceAfterProfit",
      key: "salePriceAfterProfit",
      align: "center",
      render: (_, record) => record.salePriceAfterProfit ?? t("No Price")
    },
    {
      title: t("Stock"),
      dataIndex: "productProviders",
      key: "stock",
      align: "center",
      render: (_, record) => record.countInStock ?? t("No Stock")
    },
    {
      title: t("Vendor"),
      dataIndex: "productProviders",
      key: "vendor",
      align: "center",
      render: (_, record) => record.provider?.username || t("No Vendor")
    },
    {
      title: t("image"),
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      render: (_, record) => {
        const imageUrl = record.product?.imageUrl;
        return imageUrl ? (
          <img
            style={{ width: "50px", height: "60px", borderRadius: "50%" }}
            src={imageUrl}
            alt={t("product_image")}
          />
        ) : (
          <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
            P
          </Avatar>
        );
      }
    },

    {
      title: t(""),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            onClick={() => AddProductInTable(record?.product?.id)}
            color="danger"
            variant="solid"
          >
            {t("AddProduct")}
          </Button>
          {record?.product?.status === "PENDING" ? (
            <Button
              onClick={() => StateProduct(record?.product?.id)}
              color="danger"
              variant="solid"
            >
              {t("Active")}
            </Button>
          ) : (
            ""
          )}
        </div>
      )
    }
  ];

  const onFinish = async (values) => {
    await ApiData().AddProfitMargin(values);
    await gatProfit();
    await gitProduct();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Form
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ maxWidth: 550 }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "end" }}>
          <Form.Item label={t("current_profit_margin")} style={{ flex: 1 }}>
            <Input value={currentValue} disabled />
          </Form.Item>

          <Form.Item
            label={t("add_profit_margin")}
            required
            style={{ flex: 1 }}
          >
            <Space.Compact>
              <Form.Item
                name="current"
                noStyle
                rules={[
                  {
                    required: true,
                    message: t("add_profit_margin_required")
                  }
                ]}
              >
                <Input
                  type="number"
                  maxLength={3}
                  style={{ width: 170 }}
                  onInput={(e) => {
                    if (e.target.value.length > 3) {
                      e.target.value = e.target.value.slice(0, 3);
                    }
                  }}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                {t("Submit")}
              </Button>
            </Space.Compact>
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
