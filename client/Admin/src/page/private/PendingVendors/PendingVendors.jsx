import { Table } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "../Api";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
export default function PendingVendors() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const PendingVendors = async () => {
    setUsers(await ApiData().PendingVendor());
  };

  useEffect(() => {
    PendingVendors();
  }, []);

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
        <a onClick={() => ConfirmVendor(record.id)}>{t("confirm")}</a>
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
        pagination={{ pageSize: 20 }}
      />
    </>
  );
}
