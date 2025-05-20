import { Table } from "antd";
import { useEffect, useState } from "react";
import { ApiData } from "../Api";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
export default function BinUser() {
const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const gitBinUser = async () => {
    setUsers(await ApiData().AllBin());
  };

  useEffect(() => {
    gitBinUser();
  }, []);

  const UnBin = async (id) => {
    try {
      await ApiData().UnBan(id);
      gitBinUser();
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
      title: t("role"),
      dataIndex: "roles",
      align: "center",
      key: "roles"
    },

    {
      title: "",
      dataIndex: "",
      align: "center",
      key: "Bin",
      render: (_, record) => (
        <a onClick={() => UnBin(record.id)}>{t("unBan")}</a>
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
