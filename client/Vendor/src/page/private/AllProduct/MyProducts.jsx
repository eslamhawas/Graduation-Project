import { Button, Pagination, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "./Api";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import cookies from "js-cookie";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";

export default function MyProducts() {
   
      const { t } = useTranslation();
      const [Product, setProduct] = useState([]);
      const [pageSize, setPageSize] = useState(20);
      const [currentPage, setCurrentPage] = useState(1);
      const [loading, setLoading] = useState(false);
      const ln = cookies.get("i18next") || "en";
      const navigate = useNavigate();


   const gitProduct = async () => {
    setLoading(true);
    try {
      const data = await ApiData().MyProducts(currentPage, pageSize);
      setProduct(data.data);
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gitProduct();
  }, []);

  useEffect(() => {
    gitProduct();
  }, [currentPage, pageSize]);

  const DelateProduct = async (id) => {
    try {
      await ApiData().DelateProduct(id);
      gitProduct();
      toast.success(t("Success"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const UpdateProduct = async (id) => {
    navigate(`/UpdateProductMe/${id}`);
  };



    const columns = [
    {
      title: t("Product Name"),
      dataIndex: "name",
      key: "name",
      align: "center"
    },
    {
      title: t("Category"),
      dataIndex: "categories",
      key: "category",
      align: "center",
      render: (_, record) => record.categories?.[0]?.name || t("No Category")
    },
    {
      title: t("Brand"),
      dataIndex: "brand",
      key: "brand",
      align: "center",
      render: (_, record) => record.brand?.name || t("No Brand")
    },
    {
      title: t("Price"),
      dataIndex: "productProviders",
      key: "price",
      align: "center",
      render: (_, record) =>
        record.productProviders?.[0]?.salePrice ?? t("No Price")
    },
    {
      title: t("Stock"),
      dataIndex: "productProviders",
      key: "stock",
      align: "center",
      render: (_, record) =>
        record.productProviders?.[0]?.countInStock ?? t("No Stock")
    },
    {
      title: t("Image"),
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      render: (imageUrl) =>
        imageUrl ? (
          <img
            style={{ width: "50px", height: "60px", borderRadius: "8px" }}
            src={imageUrl}
            alt="Product"
          />
        ) : (
          <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
            P
          </Avatar>
        )
    },

    {
      title: t(""),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            onClick={() => UpdateProduct(record.id)}
            color="danger"
            variant="solid"
          >
            {t("update")}
          </Button>
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
  return (
    <>
      <Button
        color="danger"
        variant="solid"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "0px 0px 20px"
        }}
        onClick={()=>navigate("/AddProductMe")}
      >
        {t("AddProductNew")}
      </Button>
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
  )
}
