import { Button, Pagination, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "./Api";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import cookies from "js-cookie";
import { Option } from "antd/es/mentions";

export default function Transaction() {
  const { t } = useTranslation();
  const [Product, setProduct] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ln = cookies.get("i18next") || "en";


  const getTransaction = async () => {
    setLoading(true);
    try {
      const data = await ApiData().transactionData( currentPage , pageSize);
      setProduct(data.data);
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransaction();
  }, []);

  useEffect(() => {
    getTransaction();
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: t("Product Name"),
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (_, record) => record.product.name || t("No name")
    },
        {
      title: t("Vendor"),
      dataIndex: "Vendor",
      key: "Vendor",
      align: "center",
      render: (_, record) => record.provider.fullName || t("No vendor")
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => record.quantity || t("No quantity")
    },
    {
      title: t("Price"),
      dataIndex: "itemSalePrice",
      key: "itemSalePrice",
      align: "center",
      render: (_, record) => record.itemSalePrice || t("No Price")
    },
    {
      title: t("SalePrice"),
      dataIndex: "itemSalePriceAfterProfitAndPromoIfExist",
      key: "itemSalePriceAfterProfitAndPromoIfExist",
      align: "center",
      render: (_, record) =>
        record.itemSalePriceAfterProfitAndPromoIfExist ?? t("No Price")
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => record.status ?? t("No status")
    }
  ];
  return (
    <>
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
