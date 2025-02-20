import i18n from "client/Vendor/src/Core/I18Next.jsx";
import {  initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(initReactI18next)
  .use(LanguageDetector) 
  .use(HttpApi)
  .init({

    fallbackLng: "en",
    detection: {
      order: ['cookie' ,'htmlTag' , 'querystring', 'localStorage', 'navigator' ],
      caches: ['cookie'],
    },
    backend :{
      loadPath : '/translate/{{lng}}.json'
    }
   
  });

  export default i18n