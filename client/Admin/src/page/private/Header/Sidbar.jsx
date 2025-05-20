import { Suspense, useState } from "react";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { FaRegUser } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";
import { LuUserRoundX } from "react-icons/lu";
import { Button, Layout, Menu } from "antd";
const { Content, Sider } = Layout;
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label
  };
}

export default function Sidbar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const items = [
     getItem(`${t("AllProduct")}`, "6",<MdOutlineProductionQuantityLimits />, "/AllProduct"),
          getItem(`${t("MyProducts")}`, "7",<AiOutlineProduct />, "/MyProducts"),
     
    getItem(`${t("AllUser")}`, "1", <FaRegUser />, "/AllUser"),
    getItem(`${t("AllAdmin")}`, "2", <FaUserTie />, "/AllAdmin"),
    getItem(`${t("AllVendors")}`, "3", <RiAdminLine />, "/AllVendors"),
    getItem(
      `${t("PendingVendors")}`,
      "4",
      <LuUserRoundPlus />,
      "/PendingVendors"
    ),
    getItem(`${t("BannedUsers")}`, "5", <LuUserRoundX />, "/BannedUsers")
  ];

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh"
        }}
      >
        <Sider
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ position: "relative", minHeight: "100vh" }}
        >
          <Menu defaultSelectedKeys={[location.pathname]} mode="inline">
            {items.map((item) => (
              <Menu.Item key={item.children} icon={item.icon}>
                <Link to={item.children}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              textAlign: "center",
              padding: "10px"
            }}
          >
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: "100%" }}
            >
              {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </Button>
          </div>
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "60px 16px 0px "
            }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
