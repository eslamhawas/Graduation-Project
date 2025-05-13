import { Avatar, Layout, Menu } from "antd";
import {
  MoonOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  SunOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  useState,
  useEffect,
  useRef,
  memo,
  useContext
} from "react";
import imgLogo from "../../../Image/Screenshot_2024-11-16_180021-removebg-preview 2.webp";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import i18n from "../../../Core/I18Next";
import {  useSelector } from "react-redux";
import { contextDarkMode } from "../../Context/DarkMode";
import imgEN from "../../../Image/pngtree-american-flag-usa-circle-icon-png-image_4742100.webp";
import imgAR from "../../../Image/pngtree-egypt-round-flag-glossy-glass-effect-vector-transparent-background-png-image_11427247.webp";


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

  const items = [
    { key: "1", label: `${t("Home")}`, to: "/Home" },
    { key: "2", label: `${t("Contact")}`, to: "/Contact" },
    { key: "3", label: `${t("About")}`, to: "/About" },
    { key: "5", label: `${t("SignUp")}`, to: "/Signup" }
  ];

  if (authToken) {
    items.push({ key: "4", label: `${t("LogOut")}`, onClick: handleLogout });
    if (isMobile) {
      items.push({
        key: "8",
        label: <Avatar size="small" icon={<UserOutlined />} />,
        to: "/Profile"
      });
    }
  } else {
    items.push({ key: "4", label: `${t("SignIn")}`, to: "/Signin" });
  }

  if (isMobile) {
    items.push(
      {
        key: "6",
        label: <ShoppingCartOutlined />,
        to: "/Cart"
      },
      {
        key: "7",
        label: <SearchOutlined />,
        to: "/Search"
      }
    );
  }

  return (
    <Layout>
      <Layout.Header
        className="StyleHeader2"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div className="demo-logo">
          <img
            loading="eager"
            src={imgLogo}
            alt="logo"
            width={"auto"}
            height={"auto"}
          />
        </div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}
          style={{ flex: 1, minWidth: 0 }}
        >
          {items.map((item) => (
            <Menu.Item key={item.to} onClick={item.onClick}>
              {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
            </Menu.Item>
          ))}
        </Menu>
        {dir == "ar" ? (
          <img
            src={imgEN}
            alt="en"
            width={"30px"}
            onClick={() => i18n.changeLanguage("en")}
            style={{margin:"0px 10px"}}
          />
        ) : (
          <img
            src={imgAR}
            alt="ar"
            width={"23px"}
              style={{margin:"0px 10px"}}
            onClick={() => i18n.changeLanguage("ar")}
          />
        )}
        <div className="darkmodeicone">
          <SunOutlined id="sun" ref={sun} onClick={() => darkSun()} />
          <MoonOutlined id="moon" ref={moon} onClick={() => darkMoon()} />
        </div>
        {!isMobile && (
          <div className="IconHeader2">
            <Link to={"/Search"}>
              <SearchOutlined className="search" />
            </Link>
            <Link to={"/Cart"}>
              <ShoppingCartOutlined className="cart" />
            </Link>
            {authToken ? (
              <Link to={"/Profile"}>
                <Avatar
                  className="avatar"
                  size="small"
                  icon={<UserOutlined />}
                />
              </Link>
            ) : (
              ""
            )}
          </div>
        )}
      </Layout.Header>
    </Layout>
  );
}

export default memo(Header);
