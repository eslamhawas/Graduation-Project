import { Avatar, Layout, Menu, Badge } from "antd";
import {
  MoonOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef, memo, useContext } from "react";
import imgLogo from "../../../Image/Screenshot_2024-11-16_180021-removebg-preview 2.webp";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import i18n from "../../../Core/I18Next";
import { useSelector } from "react-redux";
import { contextDarkMode } from "../../Context/DarkMode";
import imgEN from "../../../Image/pngtree-american-flag-usa-circle-icon-png-image_4742100.webp";
import imgAR from "../../../Image/pngtree-egypt-round-flag-glossy-glass-effect-vector-transparent-background-png-image_11427247.webp";
import { useCart } from "../../Context/Cartcontext";

function Header(props) {
  const { t } = useTranslation();
  const location = useLocation();
  const { handleLogout } = props;
  const authToken = useSelector((state) => state.sliceAuthToken?.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dir = cookies.get("i18next") || "en";
  const sun = useRef();
  const moon = useRef();
  const { darkMode, lightMode } = useContext(contextDarkMode);
  const { cart } = useCart(); 
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [dir]);

  const darkSun = () => {
    sun.current.style.visibility = "hidden";
    moon.current.style.visibility = "visible";
    document.body.classList.add("dark");
    window.localStorage.dark = "dark";
    darkMode();
  };

  const darkMoon = () => {
    sun.current.style.visibility = "visible";
    moon.current.style.visibility = "hidden";
    document.body.classList.remove("dark");
    window.localStorage.removeItem("dark");
    lightMode();
  };

  useEffect(() => {
    if (window.localStorage.dark) {
      darkSun();
    }
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leftMenuItems = [
    { key: "/Home", label: t("Home"), to: "/Home" },
    { key: "/Contact", label: t("Contact"), to: "/Contact" },
    { key: "/About", label: t("About"), to: "/About" },
  ];

  const rightMenuItems = [];

  if (authToken) {
    rightMenuItems.push({ key: "/Logout", label: t("LogOut"), onClick: handleLogout });
  } else {
    rightMenuItems.push({ key: "/Signin", label: t("SignIn"), to: "/Signin" });
    rightMenuItems.push({ key: "/Signup", label: t("SignUp"), to: "/Signup" });
  }

  return (
    <Layout>
      <Layout.Header className="ant-layout-header">
        <div className="demo-logo">
          <img
            loading="eager"
            src={imgLogo}
            alt="logo"
            width={"auto"}
            height={"auto"}
          />
        </div>

        <div className="center-menu">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="centered-menu"
          >
            {leftMenuItems.map((item) => (
              <Menu.Item key={item.key} onClick={item.onClick}>
                {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
              </Menu.Item>
            ))}
          </Menu>
        </div>

        <div className="right-section">
          <div className="right-icons">
            <Link to="/Search">
              <SearchOutlined className="search" />
            </Link>
            <Link to="/Cart" style={{ position: 'relative' }}>
              <Badge 
                count={cartItemCount}
                style={{ 
                  backgroundColor: '#DB4444',
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px'
                }}
              >
                <ShoppingCartOutlined className="cart" />
              </Badge>
            </Link>

            {authToken && (
              <Link to="/account">
                <Avatar className="avatar" size="small" icon={<UserOutlined />} />
              </Link>
            )}
          </div>

          <div className="right-menu">
            {dir === "ar" ? (
              <img
                src={imgEN}
                alt="en"
                width={"30px"}
                onClick={() => i18n.changeLanguage("en")}
                style={{ margin: "0px 10px", cursor: "pointer" }}
              />
            ) : (
              <img
                src={imgAR}
                alt="ar"
                width={"23px"}
                style={{ margin: "0px 10px", cursor: "pointer" }}
                onClick={() => i18n.changeLanguage("ar")}
              />
            )}
            
            <div className="darkmodeicone">
              <SunOutlined id="sun" ref={sun} onClick={darkSun} />
              <MoonOutlined id="moon" ref={moon} onClick={darkMoon} />
            </div>

            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              className="right-menu-items"
            >
              {rightMenuItems.map((item) => (
                <Menu.Item key={item.key} onClick={item.onClick}>
                  {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
                </Menu.Item>
              ))}
            </Menu>
          </div>
        </div>
      </Layout.Header>
    </Layout>
  );
}

export default memo(Header);