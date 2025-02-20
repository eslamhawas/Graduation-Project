import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routers from './Core/Router.jsx'
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import {  DARK_ANT_THEME, LIGHT_ANT_THEME } from './Core/Config.jsx';
import { Provider, useSelector } from 'react-redux';
import store from './page/Redux/Store.jsx';


const App = () => {
  const darkMode = useSelector((state) => state.sliceDarkMode.dark); 

  return (
    <ConfigProvider theme={darkMode  ? LIGHT_ANT_THEME : DARK_ANT_THEME}>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={Routers} />
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App /> 
    </Provider>
  </StrictMode>
);