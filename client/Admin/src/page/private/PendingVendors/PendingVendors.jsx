import { Button, Pagination, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "../Api";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import cookies from "js-cookie";
import { Option } from "antd/es/mentions";

export default function PendingVendors() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
        const [pageSize, setPageSize] = useState(20);
        const [currentPage, setCurrentPage] = useState(1);
        const [loading, setLoading] = useState(false);
        const ln = cookies.get("i18next") || "en";

  const PendingVendors = async () => {
        setLoading(true);
    try {
      const data = await ApiData().PendingVendor(currentPage, pageSize);
      setUsers(data);
    } catch (err) {
      toast.error(t("ConnectionProblemOccurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    PendingVendors();
  }, []);
    useEffect(() => {
    PendingVendors();
  }, [currentPage, pageSize]);

  const BanVendor = async (id) => {
    try {
      await ApiData().BinUser(id);
      PendingVendors();
      toast.success(t("Success"));
    } catch (err) {
      toast.error(err.message);
    }
  };

    const ConfirmVendor = async (id) => {
    try {
      await ApiData().ConfirmVendor(id);
      PendingVendors();
      toast.success(t("Success"));
    } catch (err) {
      toast.error(err.message);
    }
  };


  const columns = [
    {
      title: t("Email"),
      dataIndex: "email",
      align: "center",
      key: "email"
    },
    {
      title: t("FullName"),
      dataIndex: "fullName",
      align: "center",
      key: "fullName"
    },
    {
      title: t("UserName"),
      dataIndex: "username",
      align: "center",
      key: "username"
    },
    {
      title: t("Phone"),
      dataIndex: "phoneNumber",
      align: "center",
      key: "phoneNumber"
    },
    {
      title: t("profileImage"),
      dataIndex: "profileImageUrl",
      align: "center",
      key: "profileImageUrl",
      render: (_, record) =>
        record.profileImageUrl ? (
          <img
            style={{ width: "50px", height: "60px", borderRadius: "60%" }}
            src={`${record.profileImageUrl}`}
            alt="Photo"
          />
        ) : (
          <Avatar size="small" icon={<UserOutlined />} />
        )
    },
        {
      title: "",
      dataIndex: "",
      align: "center",
      key: "confirm",
      render: (_, record) => (
        <Button  color="danger" variant="solid" onClick={() => ConfirmVendor(record.id)}>{t("confirm")}</Button>
      )
    },

    {
      title: "",
      dataIndex: "",
      align: "center",
      key: "Bin",
      render: (_, record) => (
        <a onClick={() => BanVendor(record.id)}>{t("bin")}</a>
      )
    }
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total:  Array.isArray(users) ? users.length : 0, 
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
                total={ Array.isArray(users) ? users.length : 0}
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
