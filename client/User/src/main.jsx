import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routers from './Core/Router'
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import {  DARK_ANT_THEME, LIGHT_ANT_THEME } from './Core/Config';
import { Provider } from 'react-redux';
import store from './page/Redux/Store';
import DarkModoContext, { contextDarkMode } from "./page/Context/DarkMode"


const App = () => {
  const {dark} = useContext(contextDarkMode) 

  return (
    <ConfigProvider theme={dark  ? LIGHT_ANT_THEME : DARK_ANT_THEME}>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={Routers} />
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <DarkModoContext >
      <App /> 
      </DarkModoContext>
    </Provider>
  </StrictMode>
);