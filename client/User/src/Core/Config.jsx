import { theme } from 'antd';
import { Navigate } from 'react-router-dom';

const LIGHT_ANT_THEME = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: 'rgba(219, 68, 68, 1)',
    colorText: 'rgba(0, 0, 0, 1)',
    colorBorder: 'rgba(0, 0, 0, 0.3)',
    colorBgBase: '#FFFFFF',
  },
  components: {
    Input: {
      colorTextPlaceholder: 'rgba(0, 0, 0, 1)',
    },
    Layout: {
      colorBgContainer: '#FFFFFF',
    },
    Menu: {
      itemColor: 'rgba(0, 0, 0, 1)',
      itemSelectedColor: 'rgba(219, 68, 68, 1)',
      itemHoverColor: 'rgba(219, 68, 68, 1)',
      borderRadius: 10,
    },
    Header: {
      colorBgHeader: '#FFFFFF',
      borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
      boxShadow: 'none',
      borderRadius: 10,
    },
  },
};


const DARK_ANT_THEME = {

  token: {
    colorPrimary: "rgba(219, 68, 68, 1)",
    colorText: "rgba(255, 255, 255, 0.87)",
    colorBorder: "rgba(255, 255, 255, 0.2)",
    colorBgBase: "#1E1E1E ",
    colorBgHeader: "#1E1E1E",

  },
  components: {
    Layout: {
      colorBgContainer: "#121212",
    },
    Input: {
      colorTextPlaceholder: 'rgba(255, 255, 255, 0.87)',
    },
    Menu: {
      colorItemText: "rgba(255, 255, 255, 0.87)",
      colorItemTextSelected: "rgba(219, 68, 68, 1)",
      colorItemTextHover: "rgba(219, 68, 68, 1)",
      borderRadius: 10,
    },
    Header: {
      colorBgHeader: "#1E1E1E ",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "none",
      borderRadius: 10,
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 1000,
    },
  },
};

function ProtectedRoutes(props) {
  if (!localStorage.getItem("userToken")) {

    return <Navigate to="/Signin" />;

  }
  return props.children;
}
export { LIGHT_ANT_THEME, DARK_ANT_THEME, ProtectedRoutes };
