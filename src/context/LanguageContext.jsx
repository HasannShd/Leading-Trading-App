import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  SUPPORTED_LANGUAGES,
  translateCategoryDescription,
  translateCategoryName,
  translateText,
} from '../utils/localization';

const LANGUAGE_STORAGE_KEY = 'lte-language';

const LanguageContext = createContext(null);

const readInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES[saved] ? saved : 'en';
  } catch {
    return 'en';
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(readInitialLanguage);
  const languageMeta = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } catch {
        // Private browsing or storage restrictions should not block language switching.
      }
    }

    document.documentElement.lang = languageMeta.code;
    document.documentElement.dir = languageMeta.dir;
    document.documentElement.dataset.language = languageMeta.code;
  }, [language, languageMeta]);

  const value = useMemo(() => {
    const setLanguage = (nextLanguage) => {
      setLanguageState(SUPPORTED_LANGUAGES[nextLanguage] ? nextLanguage : 'en');
    };

    const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

    return {
      language,
      direction: languageMeta.dir,
      isArabic: language === 'ar',
      languageMeta,
      setLanguage,
      toggleLanguage,
      t: (valueToTranslate, fallback) => translateText(language, valueToTranslate, fallback ?? valueToTranslate),
      categoryName: (valueToTranslate) => translateCategoryName(language, valueToTranslate),
      categoryDescription: (valueToTranslate) => translateCategoryDescription(language, valueToTranslate),
    };
  }, [language, languageMeta]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider');
  }
  return context;
};
