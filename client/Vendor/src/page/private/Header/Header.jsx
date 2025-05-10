import { Avatar, Layout, Menu } from "antd";
import { MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef, memo } from "react";
import imgLogo from "../../../Image/Screenshot_2024-11-16_180021-removebg-preview 2.webp";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import i18n from "../../../Core/I18Next";
import { useDispatch, useSelector } from "react-redux";
import { darkMode, lightMode } from "../../Redux/DarkMode";

function Header(props) {
  const { t } = useTranslation();
  const location = useLocation();
  const handleLogout = props.handleLogout;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dir = cookies.get("i18next") || "en";
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.sliceAuthToken?.auth);
  const sun = useRef();
  const moon = useRef();

  console.log(authToken);

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [dir]);

  const darkSun = () => {
    sun.current.style.visibility = "hidden";
    moon.current.style.visibility = "visible";
    document.body.classList.add("dark");
    window.localStorage.dark = "dark";
    dispatch(darkMode());
  };

  const darkMoon = () => {
    sun.current.style.visibility = "visible";
    moon.current.style.visibility = "hidden";
    document.body.classList.remove("dark");
    window.localStorage.removeItem("dark");
    dispatch(lightMode());
  };

  useEffect(() => {
    if (window.localStorage.dark) {
      darkSun();
    }
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [{ key: "1", label: `${t("SignUp")}`, to: "/Signup" }];

  if (authToken) {
    items.push({ key: "3", label: `${t("LogOut")}`, onClick: handleLogout });
    if (isMobile) {
      items.push({
        key: "3",
        label: <Avatar size="small" icon={<UserOutlined />} />,
        to: "/Profile"
      });
    }
  } else {
    items.push({ key: "2", label: `${t("SignIn")}`, to: "/Signin" });
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
        <img
          src={imgLogo}
          style={{ marginLeft: "27px" }}
          alt="LOGO"
          className="demo-logo-vertical"
        />
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, minWidth: 0 }}
        >
          {items.map((item) => (
            <Menu.Item key={item.to} onClick={item.onClick}>
              {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
            </Menu.Item>
          ))}
        </Menu>
        <select
          onChange={(languageValue) =>
            i18n.changeLanguage(languageValue.target.value)
          }
          className="selectLanguage"
        >
          <option value="en">En</option>
          <option value="ar">Ar</option>
        </select>
        <div className="darkmodeicone">
          <SunOutlined id="sun" ref={sun} onClick={() => darkSun()} />
          <MoonOutlined id="moon" ref={moon} onClick={() => darkMoon()} />
        </div>
        {!isMobile && authToken && (
          <div className="IconHeader2">
            <Link to={"/Profile"}>
              <Avatar className="avatar" size="small" icon={<UserOutlined />} />
            </Link>
          </div>
        )}
      </Layout.Header>
    </Layout>
  );
}

export default memo(Header);
