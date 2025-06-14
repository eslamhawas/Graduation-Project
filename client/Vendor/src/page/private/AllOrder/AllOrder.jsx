import { Button, Pagination, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "./Api";
import { Avatar } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import cookies from "js-cookie";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";
export default function AllOrder() {
  const { t } = useTranslation();
  const [order, setOrder] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ln = cookies.get("i18next") || "en";
  const navigate = useNavigate();

  const gitProduct = async () => {
    setLoading(true);
    try {
      const data = await ApiData().AllOrder(currentPage, pageSize);
      setOrder(data.data);
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

  const RejectedOrder = async (id) => {
    setLoading(true);
    const body = {
      status: "REJECTED"
    };
    try {
      await ApiData().ConfirmOrder(id, body);
      await gitProduct();
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const ConfirmOrder = async (id) => {
    setLoading(true);
    const body = {
      status: "ACCEPTED"
    };
    try {
      await ApiData().ConfirmOrder(id, body);
      await gitProduct();
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
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
      title: t("status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => record.status || t("No status")
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => record.quantity || t("No quantity")
    },
    {
      title: t("SalePrice"),
      dataIndex: "itemSalePriceAfterProfitAndPromoIfExist",
      key: "itemSalePriceAfterProfitAndPromoIfExist",
      align: "center",
      render: (_, record) =>
        record.itemSalePriceAfterProfitAndPromoIfExist ?? t("No SalePrice")
    },
    {
      title: t("createdDate"),
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (_, record) =>
        record.createdDate.split("T")[0] ?? t("No createdDate")
    },

    {
      title: t(""),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {record.status === "PENDING" ? (
            <>
              <Button
                onClick={() => ConfirmOrder(record?.order?.id)}
                color="danger"
                variant="solid"
              >
                {t("Confirm")}
              </Button>
              <Button
                onClick={() => RejectedOrder(record?.order?.id)}
                color="danger"
                variant="solid"
              >
                {t("Rejected")}
              </Button>
            </>
          ) : record.status === "ACCEPTED" ? (
""
          ) : (
""
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={order}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: Array.isArray(order) ? order.length : 0,
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
                total={Array.isArray(order) ? order.length : 0}
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
