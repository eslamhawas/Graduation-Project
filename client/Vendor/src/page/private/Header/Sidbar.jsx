
import { Suspense, useState } from 'react';
import {
  FundViewOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Content, Sider } = Layout;
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}



export default function Sidbar() {

  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false);
  const {t} =useTranslation()

  const items = [
    getItem(`${t("AllProdact")}`, '1', <FundViewOutlined />, '/AllProducts'),
    getItem(`${t("AddProducts")}`, '2', <AppstoreAddOutlined/>, "/AddProduct"),
  ];

  return (<>

    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider  collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu  defaultSelectedKeys={[location.pathname]} mode="inline"  >
          {items.map((item) => (
            <Menu.Item key={item.children} icon={item.icon}>
              <Link to={item.children}>{item.label}</Link>
            </Menu.Item>
          ))}

        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '60px 16px 0px ',
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>

        </Content>
      </Layout>
    </Layout>
    
    </>);
}
