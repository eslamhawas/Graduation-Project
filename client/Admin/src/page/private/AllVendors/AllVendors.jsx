import { Table } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "../Api";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
export default function AddProduct() {
 const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const gitVendor = async () => {
    setUsers(await ApiData().AllVendor());
  };

  useEffect(() => {
    gitVendor();
  }, []);

  const delateProduct = async (id) => {
    try {
      await ApiData().BinUser(id);
      gitVendor();
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
      key: "Bin",
      render: (_, record) => (
        <a onClick={() => delateProduct(record.id)}>{t("bin")}</a>
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
