
import {  initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import i18next from "i18next";

i18next
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

  export default i18next