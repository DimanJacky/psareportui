import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translation from 'locales';


i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        resources: translation,
        fallbackLng: 'ru',
        load: 'languageOnly',
        nonExplicitSupportedLngs: true,
        ns: ['app', 'report'],
        defaultNS: 'report',
        react: { useSuspense: true },
        interpolation: {
            escapeValue: false
        }
    }, (err, t) => {
        if(err)
            console.error(err, t);
    });

i18n.changeLanguage();

export default i18n;
